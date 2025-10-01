import Project from '../models/Project.js';
import User from '../models/User.js';
import Social from '../models/Social.js';

export const createProject = async (req, res) => {
    try {
        const { title, description, startDate, dueDate, priority, status, members } = req.body;

        const logoUrl = req.file ? req.file.path : null;
        const ownerId = req.user._id;

        if (!title || !startDate) {
            return res.status(400).json({ message: 'Please provide title and start date.' });
        }

        const allMemberIds = [...new Set([ownerId.toString(), ...(members || [])])];
        const existingUsersCount = await User.countDocuments({ '_id': { $in: allMemberIds } });

        if (existingUsersCount < allMemberIds.length) {
            return res.status(400).json({ message: 'Validation failed: One or more specified members do not exist.' });
        }

        const project = new Project({
            title,
            description: description || '',
            logo: logoUrl,
            startDate,
            dueDate: dueDate || null,
            priority,
            status,
            ownerId,
            members: allMemberIds,
            admins: [ownerId.toString()]
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);

    } catch (error) {
        console.error('Error creating project:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error while creating project.' });
    }
};

export const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id;
        const projects = await Project.find({ members: userId }).sort({ createdAt: -1 });
        res.status(200).json(projects);
    } catch (error) {
        console.error('Error fetching user projects:', error);
        res.status(500).json({ message: 'Server error while fetching projects.' });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Ensure the user is a member of the project
        if (!project.members.includes(req.user._id.toString())) {
            return res.status(403).json({ message: 'User not authorized to view this project.' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project by ID:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // CORRECTED: Allow owners or admins to update
        const isOwner = project.ownerId.toString() === req.user._id.toString();
        const isAdmin = project.admins.includes(req.user._id.toString());

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'User not authorized to update this project.' });
        }

        const { title, description, startDate, dueDate, priority, status } = req.body;
        
        // Check for each field before updating
        if (title !== undefined) project.title = title;
        if (description !== undefined) project.description = description;
        if (startDate !== undefined) project.startDate = startDate;
        if (dueDate !== undefined) project.dueDate = dueDate;
        if (priority !== undefined) project.priority = priority;
        if (status !== undefined) project.status = status;
        
        // ADDED: Handle file upload for the logo
        if (req.file) {
            project.logo = req.file.path;
        }

        const updatedProject = await project.save();
        res.status(200).json(updatedProject);

    } catch (error) {
        console.error('Error updating project:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error.' });
    }
};

export const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        if (project.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'User not authorized to delete this project.' });
        }

        await project.deleteOne();
        res.status(200).json({ message: 'Project deleted successfully.' });

    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const addProjectMember = async (req, res) => {
    try {
        const { email } = req.body;
        const project = await Project.findOne({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const memberToAdd = await User.findOne({ email });
        if (!memberToAdd) {
            return res.status(404).json({ message: `User with email ${email} not found.` });
        }

        if (project.members.includes(memberToAdd._id.toString())) {
            return res.status(400).json({ message: 'User is already a member of this project.' });
        }

        project.members.push(memberToAdd._id);
        await project.save();

        res.status(200).json({ message: 'Member added successfully.', members: project.members });

    } catch (error) {
        console.error('Error adding member:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const addProjectAdmin = async (req, res) => {
    try {
        const { email } = req.body;
        const project = await Project.findOne({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const adminToAdd = await User.findOne({ email });
        if (!adminToAdd) {
            return res.status(404).json({ message: `User with email ${email} not found.` });
        }

        if (!project.members.includes(adminToAdd._id.toString())) {
            project.members.push(adminToAdd._id);
        }

        if (project.admins.includes(adminToAdd._id.toString())) {
            return res.status(400).json({ message: 'User is already an admin for this project.' });
        }

        project.admins.push(adminToAdd._id);
        await project.save();

        res.status(200).json({ message: 'Admin added successfully.', admins: project.admins });

    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const removeProjectMember = async (req, res) => {
    try {
        const { id, memberId } = req.params;
        const project = await Project.findOne({ _id: id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const isAdmin = project.admins.includes(req.user._id.toString());

        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can remove members.' });
        }

        if (project.ownerId.toString() === memberId) {
            return res.status(400).json({ message: 'The project owner cannot be removed.' });
        }

        project.members = project.members.filter(m => m.toString() !== memberId);
        project.admins = project.admins.filter(a => a.toString() !== memberId);

        await project.save();

        res.status(200).json({ message: 'Member removed successfully.', project });

    } catch (error) {
        console.error('Error removing member:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const removeProjectAdmin = async (req, res) => {
    try {
        const { id, adminId } = req.params;
        const project = await Project.findOne({ _id: id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const isAdmin = project.admins.includes(req.user._id.toString());

        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can remove admins.' });
        }

        if (project.ownerId.toString() === adminId) {
            return res.status(400).json({ message: 'The project owner cannot be removed as an admin.' });
        }

        project.admins = project.admins.filter(a => a.toString() !== adminId);
        project.members = project.members.filter(m => m.toString() !== adminId);
        await project.save();

        res.status(200).json({ message: 'Admin removed successfully.', admins: project.admins, members: project.members });

    } catch (error) {
        console.error('Error removing admin:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const demoteProjectAdmin = async (req, res) => {
    try {
        const { id, adminId } = req.params;
        const project = await Project.findOne({ _id: id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const isAdmin = project.admins.includes(req.user._id.toString());

        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can remove admins.' });
        }

        if (project.ownerId.toString() === adminId) {
            return res.status(400).json({ message: 'The project owner cannot be removed as an admin.' });
        }

        project.admins = project.admins.filter(a => a.toString() !== adminId);
        await project.save();

        res.status(200).json({ message: 'Admin removed successfully.', admins: project.admins, members: project.members });

    } catch (error) {
        console.error('Error removing admin:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const inviteProjectMember = async (req, res) => {
    try {
        const { email } = req.body;
        const project = await Project.findOne({ _id: req.params.id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const isAdmin = project.admins.includes(req.user._id.toString());
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can invite members.' });
        }

        const userToInvite = await User.findOne({ email });
        if (!userToInvite) {
            return res.status(404).json({ message: `User with email ${email} not found.` });
        }

        const userIdToInvite = userToInvite._id.toString();

        if (project.members.includes(userIdToInvite)) {
            return res.status(400).json({ message: 'User is already a member of this project.' });
        }

        if (project.invited.includes(userIdToInvite)) {
            return res.status(400).json({ message: 'User has already been invited to this project.' });
        }

        project.invited.push(userIdToInvite);
        await project.save();

        res.status(200).json({ message: 'User invited successfully.', invited: project.invited });

    } catch (error) {
        console.error('Error inviting member:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const removeInvitedMember = async (req, res) => {
    try {
        const { id, invitedId } = req.params;
        const project = await Project.findOne({ _id: id });

        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        const isAdmin = project.admins.includes(req.user._id.toString());
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only admins can remove invited members.' });
        }

        const initialLength = project.invited.length;
        project.invited = project.invited.filter(i => i.toString() !== invitedId);

        if (initialLength === project.invited.length) {
            return res.status(404).json({ message: 'Invited user not found in the invitation list.' });
        }

        await project.save();

        res.status(200).json({ message: 'Invitation removed successfully.', project });

    } catch (error) {
        console.error('Error removing invitation:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

export const getNonMemberFriends = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user._id;

        // Find the project to get its member list
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }

        // Security Check: Ensure the user making the request is an admin
        const isAdmin = project.admins.includes(userId.toString());
        if (!isAdmin) {
            return res.status(403).json({ message: 'Only project admins can perform this action.' });
        }

        // Find the user's social document to get their friends
        const userSocial = await Social.findOne({ userId });
        if (!userSocial || userSocial.friends.length === 0) {
            // If the user has no friends, return an empty array
            return res.status(200).json([]);
        }

        // Get an array of IDs for friends who are NOT already in the project
        const nonMemberFriendIds = userSocial.friends.filter(friendId =>
            !project.members.includes(friendId.toString())
        );

        if (nonMemberFriendIds.length === 0) {
            return res.status(200).json([]);
        }

        // Fetch the full user objects for the non-member friends, excluding sensitive data
        const potentialMembers = await User.find({
            '_id': { $in: nonMemberFriendIds }
        }).select('-password'); // Exclude password from the result

        res.status(200).json(potentialMembers);

    } catch (error) {
        console.error('Error fetching non-member friends:', error);
        res.status(500).json({ message: 'Server error while fetching potential members.' });
    }
};


const handleSaveProjectLogo = async () => {
    // assuming 'projectLogoFile' is the state holding the selected file
    // and 'projectId' is the ID of the project being edited
    if (!projectLogoFile || !projectId) return;

    setIsSavingLogo(true);
    
    // 1. Create a FormData object
    const formData = new FormData();
    
    // 2. Append the file. The key 'logo' should match your Multer setup on the backend.
    formData.append('logo', projectLogoFile); 
    // You can also append other fields if you want to update them at the same time
    // formData.append('title', 'New Project Title');

    try {
        const response = await fetch(`/api/projects/${projectId}`, { // Your project update endpoint
            method: 'PUT',
            credentials: 'include',
            
            // 3. DO NOT set the 'Content-Type' header here!
            // The browser will automatically set it to 'multipart/form-data'.
            body: formData,
        });

        if (response.ok) {
            console.log("Project logo updated successfully!");
            // Refresh data or redirect
            window.location.reload(); 
        } else {
            console.error('Failed to update project logo');
        }
    } catch (error) {
        console.error('Error updating project logo:', error);
    } finally {
        setIsSavingLogo(false);
    }
};