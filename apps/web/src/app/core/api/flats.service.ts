import { Injectable, inject } from '@angular/core';
import type {
  CreateFlatInput,
  Flat,
  FlatQuery,
  Paginated,
  UpdateFlatInput,
} from '@flatfinder/types';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class FlatsService {
  private readonly api = inject(ApiService);

  list(query: FlatQuery = {}) {
    return this.api.get<Paginated<Flat>>('/flats', { ...query });
  }

  listMine() {
    return this.api.get<Flat[]>('/flats/mine');
  }

  getById(id: string) {
    return this.api.get<Flat>(`/flats/${id}`);
  }

  create(input: CreateFlatInput) {
    return this.api.post<Flat>('/flats', input);
  }

  update(id: string, input: UpdateFlatInput) {
    return this.api.patch<Flat>(`/flats/${id}`, input);
  }

  remove(id: string) {
    return this.api.deleteVoid(`/flats/${id}`);
  }
}
