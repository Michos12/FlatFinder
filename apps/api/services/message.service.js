import { Message } from "../models/message.model.js";

export async function getAllMessagesService(flatId) {
    const messages = await Message.find({ flatId }).sort({ createdAt: 1 });
    return messages;
}

export async function getUserMessagesService(flatId, senderId) {
    const messages = await Message.find({ flatId, senderId }).sort({ createdAt: 1 });
    return messages;
}

export async function addMessageService(messageData) {
    const newMessage = new Message(messageData);
    await newMessage.save();
    return newMessage;
}