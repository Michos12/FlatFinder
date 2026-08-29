import { Injectable, inject } from '@angular/core';
import type { Message } from '@flatfinder/types';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly api = inject(ApiService);

  /** The owner gets the whole conversation; everyone else only their own. */
  listByFlat(flatId: string) {
    return this.api.get<Message[]>(`/flats/${flatId}/messages`);
  }

  send(flatId: string, content: string) {
    return this.api.post<Message>(`/flats/${flatId}/messages`, { content });
  }
}
