import express from 'express';
import {
    getSocialProfile,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    removeFriend
} from '../controllers/SocialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Get main social profile (includes friends, sent & received requests)
router.route('/').get(getSocialProfile);

// --- Friend Request Management ---

// Send a friend request to a user with :recipientId
router.post('/request/:recipientId', sendFriendRequest);

// Accept a friend request from a user with :senderId
router.put('/request/accept/:senderId', acceptFriendRequest);

// Reject a friend request from a user with :senderId
router.put('/request/reject/:senderId', rejectFriendRequest);

// Cancel a friend request you sent to a user with :recipientId
router.put('/request/cancel/:recipientId', cancelFriendRequest);

// --- Friend Management ---

// Remove a friend with :friendId from your friends list
router.delete('/friends/:friendId', removeFriend);


export default router;