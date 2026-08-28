import type { Message as MessageDto } from '@flatfinder/types';
import { Message, type MessageDocument } from './message.model.js';

function toMessageDto(doc: MessageDocument): MessageDto {
  return {
    id: doc.id as string,
    flatId: doc.flatId.toString(),
    senderId: doc.senderId.toString(),
    content: doc.content,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function listMessagesByFlat(flatId: string): Promise<MessageDto[]> {
  const docs = await Message.find({ flatId }).sort({ createdAt: 1 });
  return docs.map(toMessageDto);
}

export async function listMessagesByFlatAndSender(
  flatId: string,
  senderId: string,
): Promise<MessageDto[]> {
  const docs = await Message.find({ flatId, senderId }).sort({ createdAt: 1 });
  return docs.map(toMessageDto);
}

export async function createMessage(
  flatId: string,
  senderId: string,
  content: string,
): Promise<MessageDto> {
  const doc = await Message.create({ flatId, senderId, content });
  return toMessageDto(doc);
}
