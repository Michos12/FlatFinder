import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { Flat } from '@flatfinder/types';
import { FlatCard } from './flat-card';

const baseFlat: Flat = {
  id: 'f1',
  city: 'Quebec',
  streetName: 'Grande Allee',
  streetNumber: 92,
  areaSize: 82,
  hasAC: false,
  yearBuilt: 1992,
  rentPrice: 2000,
  dateAvailable: '2027-01-10T00:00:00.000Z',
  description: 'Stone house with period details.',
  ownerId: 'u1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('FlatCard', () => {
  let fixture: ComponentFixture<FlatCard>;
  let component: FlatCard;

  async function render(flat: Flat): Promise<void> {
    fixture = TestBed.createComponent(FlatCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('flat', flat);
    await fixture.whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [FlatCard] });
  });

  it('uses the first photo as the cover', async () => {
    await render({
      ...baseFlat,
      imageUrls: ['https://example.test/a.jpg', 'https://example.test/b.jpg'],
    });

    expect(component.cover()).toBe('https://example.test/a.jpg');
  });

  it('falls back to the placeholder without photos', async () => {
    await render(baseFlat);
    expect(component.cover()).toBe('assets/houses/house.jpg');

    await render({ ...baseFlat, imageUrls: [] });
    expect(component.cover()).toBe('assets/houses/house.jpg');
  });

  it('shows the city and the address', async () => {
    await render(baseFlat);
    const text: string = fixture.nativeElement.textContent;

    expect(text).toContain('Flat in Quebec');
    expect(text).toContain('Grande Allee 92');
  });

  it('mentions air conditioning only when the flat has it', async () => {
    await render(baseFlat);
    expect(fixture.nativeElement.textContent).not.toContain('Air conditioning');

    await render({ ...baseFlat, hasAC: true });
    expect(fixture.nativeElement.textContent).toContain('Air conditioning');
  });

  it('shows the availability date in UTC', async () => {
    await render(baseFlat);

    // Stored at UTC midnight: rendered in local time, a negative offset would
    // show the 9th instead of the 10th.
    expect(fixture.nativeElement.textContent).toContain('10 Jan 2027');
  });

  it('leaves out the description when there is none', async () => {
    await render({ ...baseFlat, description: undefined });
    expect(fixture.nativeElement.querySelector('.flat-card__description')).toBeNull();
  });
});
