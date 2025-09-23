import mongoose from 'mongoose';
import Social from '../models/Social.js';
import User from '../models/User.js';

/**
 * @desc    Get the social profile (friends, sent & received requests) for the logged-in user
 * @route   GET /api/social
 * @access  Private
 */
export const getSocialProfile = async (req, res) => {
    try {
        // Find the user's social document and select the required fields
        const socialProfile = await Social.findOne({ userId: req.user._id })
            .select('friends friendRequests.sent friendRequests.received');

        if (!socialProfile) {
            // If no profile exists, return a default structure with empty arrays
            return res.status(200).json({
                friends: [],
                sentRequests: [],
                receivedRequests: []
            });
        }

        // Return the relevant parts of the social profile
        res.status(200).json({
            friends: socialProfile.friends,
            sentRequests: socialProfile.friendRequests.sent,
            receivedRequests: socialProfile.friendRequests.received
        });

    } catch (error) {
        console.error('Error fetching social profile:', error);
        res.status(500).json({ message: 'Server error while fetching social profile.' });
    }
};

/**
 * @desc    Send a friend request to another user
 * @route   POST /api/social/request/:recipientId
 * @access  Private
 */
export const sendFriendRequest = async (req, res) => {
    const { recipientId } = req.params;
    const senderId = req.user._id.toString();

    if (senderId === recipientId) {
        return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }

    try {
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient user not found.' });
        }

        const senderSocial = await Social.findOne({ userId: senderId });
        const recipientSocial = await Social.findOne({ userId: recipientId });

        if (!senderSocial) {
            return res.status(404).json({ message: `Social profile not found for the sender with ID ${senderId}.` });
        }

        if (!recipientSocial) {
            return res.status(404).json({ message: `Social profile not found for the recipient with ID ${recipientId}.` });
        }

        if (senderSocial.friends.includes(recipientId)) {
            return res.status(400).json({ message: 'You are already friends with this user.' });
        }

        if (senderSocial.friendRequests.sent.some(req => req.userId.toString() === recipientId)) {
            return res.status(400).json({ message: 'Friend request already sent.' });
        }

        if (senderSocial.friendRequests.received.some(req => req.userId.toString() === recipientId)) {
            return res.status(400).json({ message: 'You have a pending request from this user. Please respond to it.' });
        }

        senderSocial.friendRequests.sent.push({ userId: recipientId });
        recipientSocial.friendRequests.received.push({ userId: senderId });

        await senderSocial.save();
        await recipientSocial.save();

        res.status(200).json({ message: 'Friend request sent successfully.' });

    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Server error while sending friend request.' });
    }
};

/**
 * @desc    Accept a pending friend request
 * @route   PUT /api/social/request/accept/:senderId
 * @access  Private
 */
export const acceptFriendRequest = async (req, res) => {
    const { senderId } = req.params;
    const recipientId = req.user._id.toString();

    try {
        const recipientSocial = await Social.findOne({ userId: recipientId });
        const requestExists = recipientSocial.friendRequests.received.some(req => req.userId.toString() === senderId);

        if (!requestExists) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        const updateRecipient = Social.updateOne(
            { userId: recipientId },
            {
                $pull: { 'friendRequests.received': { userId: senderId } },
                $addToSet: { friends: senderId }
            }
        );

        const updateSender = Social.updateOne(
            { userId: senderId },
            {
                $pull: { 'friendRequests.sent': { userId: recipientId } },
                $addToSet: { friends: recipientId }
            }
        );

        await Promise.all([updateRecipient, updateSender]);

        res.status(200).json({ message: 'Friend request accepted.' });

    } catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Server error while accepting friend request.' });
    }
};

/**
 * @desc    Reject a pending friend request
 * @route   PUT /api/social/request/reject/:senderId
 * @access  Private
 */
export const rejectFriendRequest = async (req, res) => {
    const { senderId } = req.params;
    const recipientId = req.user._id.toString();

    try {
        const updateRecipient = Social.updateOne(
            { userId: recipientId },
            { $pull: { 'friendRequests.received': { userId: senderId } } }
        );

        const updateSender = Social.updateOne(
            { userId: senderId },
            { $pull: { 'friendRequests.sent': { userId: recipientId } } }
        );

        const [result] = await Promise.all([updateRecipient, updateSender]);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        res.status(200).json({ message: 'Friend request rejected.' });

    } catch (error) {
        console.error('Error rejecting friend request:', error);
        res.status(500).json({ message: 'Server error while rejecting friend request.' });
    }
};

/**
 * @desc    Cancel a friend request you have sent
 * @route   PUT /api/social/request/cancel/:recipientId
 * @access  Private
 */
export const cancelFriendRequest = async (req, res) => {
    const { recipientId } = req.params;
    const senderId = req.user._id.toString();

    try {
        const updateSender = Social.updateOne(
            { userId: senderId },
            { $pull: { 'friendRequests.sent': { userId: recipientId } } }
        );

        const updateRecipient = Social.updateOne(
            { userId: recipientId },
            { $pull: { 'friendRequests.received': { userId: senderId } } }
        );

        const [result] = await Promise.all([updateSender, updateRecipient]);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Sent friend request not found.' });
        }

        res.status(200).json({ message: 'Friend request cancelled.' });

    } catch (error) {
        console.error('Error cancelling friend request:', error);
        res.status(500).json({ message: 'Server error while cancelling friend request.' });
    }
};

/**
 * @desc    Remove a friend (unfriend)
 * @route   DELETE /api/social/friends/:friendId
 * @access  Private
 */
export const removeFriend = async (req, res) => {
    const { friendId } = req.params;
    const userId = req.user._id.toString();

    try {
        const updateUser = Social.updateOne(
            { userId },
            { $pull: { friends: friendId } }
        );

        const updateFriend = Social.updateOne(
            { userId: friendId },
            { $pull: { friends: userId } }
        );

        const [result] = await Promise.all([updateUser, updateFriend]);

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'User is not in your friends list.' });
        }

        res.status(200).json({ message: 'Friend removed successfully.' });

    } catch (error) {
        console.error('Error removing friend:', error);
        res.status(500).json({ message: 'Server error while removing friend.' });
    }
};