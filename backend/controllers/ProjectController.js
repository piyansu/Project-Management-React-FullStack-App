import Project from '../models/Project.js';
import User from '../models/User.js';

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

        const isOwner = project.ownerId.toString() === req.user._id.toString();

        if (!isOwner) {
            return res.status(403).json({ message: 'User not authorized to update this project.' });
        }

        const { title, description, startDate, dueDate, priority, status } = req.body;
        project.title = title || project.title;
        project.description = description || project.description;
        project.startDate = startDate || project.startDate;
        project.dueDate = dueDate || project.dueDate;
        project.priority = priority || project.priority;
        project.status = status || project.status;

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