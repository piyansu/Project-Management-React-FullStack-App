import { useState, useEffect, useRef } from 'react';
import { Users, UserPlus, UserMinus, Check, X, Send, Search, AlertTriangle, Mail, Clock } from 'lucide-react';

const SocialDashboard = () => {
  const [friends, setFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userDetailsCache, setUserDetailsCache] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [fetchUsersError, setFetchUsersError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, action: null, user: null, message: '' });
  const searchContainerRef = useRef(null);

  const API_BASE = `${import.meta.env.VITE_URL_BACKEND}/social`;

  // Fetch user details by ID
  const fetchUserDetails = async (userId) => {
    if (userDetailsCache[userId]) {
      return userDetailsCache[userId];
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/${userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const userDetails = await response.json();
        setUserDetailsCache(prev => ({ ...prev, [userId]: userDetails }));
        return userDetails;
      }
      return null;
    } catch (err) {
      console.error(`Failed to fetch user details for ${userId}:`, err);
      return null;
    }
  };

  // Fetch multiple user details
  const fetchMultipleUserDetails = async (userIds) => {
    const promises = userIds.map(id => fetchUserDetails(id));
    await Promise.all(promises);
  };

  // Fetch initial social data (friends, requests, etc.)
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await fetchSocialData();
      await fetchAllUsers();
      setLoading(false);
    };
    initializeData();
  }, []);

  // Effect to handle closing the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchSocialData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/social/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
        setSentRequests(data.sentRequests || []);
        setReceivedRequests(data.receivedRequests || []);
        const allUserIds = [
          ...(data.friends || []),
          ...(data.sentRequests || []).map(req => req.userId),
          ...(data.receivedRequests || []).map(req => req.userId)
        ];
        const uniqueUserIds = [...new Set(allUserIds)];
        await fetchMultipleUserDetails(uniqueUserIds);
      } else {
        setError('Failed to fetch social data');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  // Fetch all users for searching
  const fetchAllUsers = async () => {
    setIsFetchingUsers(true);
    setFetchUsersError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch users.');
      const data = await response.json();
      setAllUsers(data);
    } catch (err) {
      setFetchUsersError(err.message);
    } finally {
      setIsFetchingUsers(false);
    }
  };

  const sendFriendRequest = async () => {
    if (!selectedUser) return;
    try {
      setActionLoading('sending');
      const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/social/request/${selectedUser.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setSearchTerm('');
        setSelectedUser(null);
        setSentRequests(prev => [...prev, { userId: selectedUser.id, _id: Date.now().toString() }]);
        setUserDetailsCache(prev => ({ ...prev, [selectedUser.id]: selectedUser }));
      } else {
        setError(data.message || 'Failed to send friend request');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setActionLoading('');
    }
  };

  const handleSocialAction = async (action, endpoint, successCallback) => {
    try {
      setActionLoading(action);
      const response = await fetch(endpoint, {
        method: 'PUT', // Most actions are PUT, except remove friend
        credentials: 'include'
      });
      if (response.ok) {
        successCallback();
      } else {
        const data = await response.json();
        setError(data.message || `Failed to perform action: ${action}`);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setActionLoading('');
    }
  };

  const removeFriend = async (friendId) => {
    try {
      setActionLoading(`remove-${friendId}`);
      const response = await fetch(`${API_BASE}/friends/${friendId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setFriends(prev => prev.filter(id => id !== friendId));
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to remove friend');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setActionLoading('');
      setConfirmationModal({ isOpen: false, action: null, user: null, message: '' });
    }
  }

  const acceptFriendRequest = (senderId) => handleSocialAction(`accept-${senderId}`, `${API_BASE}/request/accept/${senderId}`, () => {
    setReceivedRequests(prev => prev.filter(req => req.userId !== senderId));
    setFriends(prev => [...prev, senderId]);
  });

  const rejectFriendRequest = (senderId) => handleSocialAction(`reject-${senderId}`, `${API_BASE}/request/reject/${senderId}`, () => {
    setReceivedRequests(prev => prev.filter(req => req.userId !== senderId));
    setConfirmationModal({ isOpen: false, action: null, user: null, message: '' });
  });

  const cancelFriendRequest = (recipientId) => handleSocialAction(`cancel-${recipientId}`, `${API_BASE}/request/cancel/${recipientId}`, () => {
    setSentRequests(prev => prev.filter(req => req.userId !== recipientId));
    setConfirmationModal({ isOpen: false, action: null, user: null, message: '' });
  });

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setSearchTerm(user.fullName);
    setIsDropdownOpen(false);
  };

  const filteredUsers = searchTerm
    ? allUsers.filter(user => user.fullName.toLowerCase().startsWith(searchTerm.toLowerCase()))
    : [];

  // Confirmation Modal handlers
  const openConfirmationModal = (action, user, message) => {
    setConfirmationModal({ isOpen: true, action, user, message });
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ isOpen: false, action: null, user: null, message: '' });
  };

  const handleConfirmAction = () => {
    const { action, user } = confirmationModal;
    if (action === 'removeFriend') {
      removeFriend(user.id);
    } else if (action === 'rejectRequest') {
      rejectFriendRequest(user.id);
    } else if (action === 'cancelRequest') {
      cancelFriendRequest(user.id);
    }
  };

  // Confirmation Modal Component
  const ConfirmationModal = () => {
    if (!confirmationModal.isOpen) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        {/* Backdrop with blur effect */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
          onClick={closeConfirmationModal}
          aria-hidden="true"
        ></div>

        {/* Modal Panel */}
        <div className="relative bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl z-10">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Confirm Action</h3>
          </div>
          <p className="text-gray-600 mb-6">{confirmationModal.message}</p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={closeConfirmationModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmAction}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  const UserProfile = ({ userId, user: directUser }) => {
    const userDetails = directUser || userDetailsCache[userId];

    if (!userDetails) {
      return (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse flex-shrink-0"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1.5 w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3">
        <div className="relative flex-shrink-0">
          {userDetails.profilePhoto ? (
            <img src={userDetails.profilePhoto} alt={userDetails.fullName} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">
              {userDetails.fullName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="font-medium text-gray-900 truncate text-sm">{userDetails.fullName}</div>
          <div className="text-xs text-gray-500 truncate">{userDetails.email}</div>
        </div>
      </div>
    );
  };

  const ActionButton = ({ onClick, loading, icon: Icon, text, variant = 'default' }) => {
    const colors = {
      accept: 'bg-green-100 text-green-700 hover:bg-green-200',
      reject: 'bg-red-100 text-red-700 hover:bg-red-200',
      default: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    };
    return (
      <button
        onClick={onClick}
        disabled={loading}
        className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer ${colors[variant]}`}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
        ) : (
          <Icon className="h-3.5 w-3.5" />
        )}
        <span>{text}</span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading social hub...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Data</h3>
        <p className="text-red-700">{error}</p>
        <button onClick={() => setError('')} className="mt-4 text-sm font-medium text-red-600 hover:underline cursor-pointer">Dismiss</button>
      </div>
    );
  }

  return (
     <div className="space-y-6 pb-10 min-h-screen">
      {/* Confirmation Modal */}
      <ConfirmationModal />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Social Hub</h1>
        <p className="text-gray-600 mt-1">Connect and manage your network</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Friends</p>
              <p className="text-2xl font-bold text-gray-900">{friends.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Received Requests</p>
              <p className="text-2xl font-bold text-green-600">{receivedRequests.length}</p>
            </div>
            <Mail className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sent Requests</p>
              <p className="text-2xl font-bold text-orange-600">{sentRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Find New Friends Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Find New Friends</h2>
        <div ref={searchContainerRef} className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search for users by name..."
            value={searchTerm}
            onChange={(e) => {
              const newSearchTerm = e.target.value;
              setSearchTerm(newSearchTerm);
              if (selectedUser) setSelectedUser(null);
              setIsDropdownOpen(!!newSearchTerm);
            }}
            className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80 cursor-text"
          />
          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full sm:w-80 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
              {isFetchingUsers ? (
                <div className="px-4 py-3 text-sm text-gray-500">Loading users...</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      {user.profilePhoto ? (
                        <img src={user.profilePhoto} alt={user.fullName} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{user.fullName}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">No users found.</div>
              )}
            </div>
          )}
        </div>
        {selectedUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <UserProfile user={selectedUser} />
            <button
              onClick={sendFriendRequest}
              disabled={actionLoading === 'sending'}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors duration-200 cursor-pointer text-sm font-semibold disabled:opacity-60"
            >
              {actionLoading === 'sending' ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/70 border-t-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>Send Request</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-2">
        {/* Friends List */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Friends ({friends.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {friends.length === 0 ? (
              <div className="text-center py-10">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No friends yet.</p>
                <p className="text-gray-400 text-xs">Use the search above to find and add friends.</p>
              </div>
            ) : (
              friends.map((friendId) => (
                <div key={friendId} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <UserProfile userId={friendId} />
                  <ActionButton
                    onClick={() => openConfirmationModal('removeFriend',
                      { id: friendId, name: userDetailsCache[friendId]?.fullName || 'this user' },
                      `Are you sure you want to remove ${userDetailsCache[friendId]?.fullName || 'this user'} from your friends?`
                    )}
                    loading={actionLoading === `remove-${friendId}`}
                    icon={UserMinus}
                    text="Remove"
                    variant="reject"
                  />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Received Requests */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Received Requests ({receivedRequests.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {receivedRequests.length === 0 ? (
              <div className="text-center py-10">
                <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No pending requests.</p>
                <p className="text-gray-400 text-xs">You're all caught up!</p>
              </div>
            ) : (
              receivedRequests.map((request) => (
                <div key={request._id} className="p-2 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex items-center justify-between">
                    <UserProfile userId={request.userId} />
                    <div className="flex gap-2">
                      <ActionButton
                        onClick={() => acceptFriendRequest(request.userId)}
                        loading={actionLoading === `accept-${request.userId}`}
                        icon={Check}
                        text="Accept"
                        variant="accept"
                      />
                      <ActionButton
                        onClick={() => openConfirmationModal('rejectRequest',
                          { id: request.userId, name: userDetailsCache[request.userId]?.fullName || 'this user' },
                          `Are you sure you want to reject the friend request from ${userDetailsCache[request.userId]?.fullName || 'this user'}?`
                        )}
                        loading={actionLoading === `reject-${request.userId}`}
                        icon={X}
                        text="Reject"
                        variant="reject"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sent Requests */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Sent Requests ({sentRequests.length})</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {sentRequests.length === 0 ? (
              <div className="text-center py-10">
                <Send className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">No sent requests.</p>
                <p className="text-gray-400 text-xs">Your outgoing requests will appear here.</p>
              </div>
            ) : (
              sentRequests.map((request) => (
                <div key={request._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md">
                  <UserProfile userId={request.userId} />
                  <ActionButton
                    onClick={() => openConfirmationModal('cancelRequest',
                      { id: request.userId, name: userDetailsCache[request.userId]?.fullName || 'this user' },
                      `Are you sure you want to cancel your friend request to ${userDetailsCache[request.userId]?.fullName || 'this user'}?`
                    )}
                    loading={actionLoading === `cancel-${request.userId}`}
                    icon={X}
                    text="Cancel"
                    variant="default"
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialDashboard;