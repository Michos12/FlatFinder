export interface Message {
  id: string;
  flatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMessageInput {
  content: string;
}
