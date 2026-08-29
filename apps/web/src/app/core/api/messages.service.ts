import { Injectable, inject } from '@angular/core';
import type { Message } from '@flatfinder/types';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly api = inject(ApiService);

  /** El propietario recibe toda la conversación; el resto, solo lo suyo. */
  listByFlat(flatId: string) {
    return this.api.get<Message[]>(`/flats/${flatId}/messages`);
  }

  send(flatId: string, content: string) {
    return this.api.post<Message>(`/flats/${flatId}/messages`, { content });
  }
}
