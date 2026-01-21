import { 
    getAllMessagesService,
    getUserMessagesService,
    addMessageService
} from "../services/message.service.js";

import { 
    getFlatByIdService
} from "../services/flat.service.js";

export async function addMessage(req, res) {
    try {
        const senderId = req.user._id;
        const flatId = req.params.id;
        const messageData = { ...req.body, senderId: senderId, flatId: flatId };
        const newMessage = await addMessageService(messageData);
        return res.status(201).json({
            success: true,
            message: "Message Created Successfully",
            data: newMessage
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

export async function getAllMessages(req, res) {
    try {
        const flatId = req.params.id;
        const flat = await getFlatByIdService(flatId);

        if(!flat){
            return res.status(404).json({ message: 'Flat is not found' });
        }

        if (!flat.ownerId.equals(req.user._id)) {
            return res.status(403).json({ message: "Unauthorized user!" });
        }

        const messages = await getAllMessagesService(flatId);

        if(!messages){
            return res.status(404).json({ message: 'Message not found' });
        }

        return res.status(200).json({
            success: true,
            message: "Message Found Successfully",
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}

export async function getUserMessages(req, res) {
    try {
        const flatId = req.params.id;
        const senderId = req.params.senderId;

        if (senderId !== req.user._id) {
            return res.status(403).json({ message: "Unauthorized user!" });
        }

        const messages = await getUserMessagesService(flatId, senderId);

        if(!messages){
            return res.status(404).json({ message: 'Message not found' });
        }

        return res.status(200).json({
            success: true,
            message: "Message Found Successfully",
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}