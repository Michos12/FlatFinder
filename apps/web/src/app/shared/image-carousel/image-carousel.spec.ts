import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImageCarousel } from './image-carousel';

const PLACEHOLDER = 'assets/houses/house.jpg';

describe('ImageCarousel', () => {
  let fixture: ComponentFixture<ImageCarousel>;
  let component: ImageCarousel;

  async function withImages(images: string[] | undefined): Promise<void> {
    fixture = TestBed.createComponent(ImageCarousel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('images', images);
    fixture.componentRef.setInput('alt', 'Flat in Quebec');
    await fixture.whenStable();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [ImageCarousel] });
  });

  it('falls back to the placeholder when a flat has no photos', async () => {
    await withImages([]);

    expect(component.slides()).toEqual([PLACEHOLDER]);
    expect(component.hasMultiple()).toBe(false);
  });

  it('treats a missing list the same as an empty one', async () => {
    await withImages(undefined);
    expect(component.current()).toBe(PLACEHOLDER);
  });

  it('hides the controls for a single photo', async () => {
    await withImages(['https://example.test/a.jpg']);

    expect(component.hasMultiple()).toBe(false);
    expect(fixture.nativeElement.querySelector('.carousel__nav')).toBeNull();
    expect(fixture.nativeElement.querySelector('.carousel__dots')).toBeNull();
  });

  it('shows the controls once there is more than one', async () => {
    await withImages(['https://example.test/a.jpg', 'https://example.test/b.jpg']);

    expect(component.hasMultiple()).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.carousel__nav').length).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('.carousel__dot').length).toBe(2);
  });

  it('moves forward and wraps round at the end', async () => {
    await withImages(['a', 'b', 'c'].map((n) => `https://example.test/${n}.jpg`));

    expect(component.index()).toBe(0);
    component.next();
    expect(component.index()).toBe(1);
    component.next();
    component.next();
    expect(component.index()).toBe(0);
  });

  it('wraps round backwards from the first photo', async () => {
    await withImages(['a', 'b', 'c'].map((n) => `https://example.test/${n}.jpg`));

    component.previous();
    expect(component.index()).toBe(2);
    expect(component.current()).toBe('https://example.test/c.jpg');
  });

  it('jumps straight to a photo', async () => {
    await withImages(['a', 'b', 'c'].map((n) => `https://example.test/${n}.jpg`));

    component.goTo(2);
    expect(component.current()).toBe('https://example.test/c.jpg');
  });

  it('stays on a valid photo when the list shrinks underneath it', async () => {
    await withImages(['a', 'b', 'c'].map((n) => `https://example.test/${n}.jpg`));
    component.goTo(2);

    // The index is clamped on read, so an owner deleting photos cannot leave
    // the carousel pointing past the end.
    fixture.componentRef.setInput('images', ['https://example.test/a.jpg']);
    await fixture.whenStable();

    expect(component.index()).toBe(0);
    expect(component.current()).toBe('https://example.test/a.jpg');
  });

  it('renders the current photo with the alt text it was given', async () => {
    await withImages(['https://example.test/a.jpg']);

    const img: HTMLImageElement = fixture.nativeElement.querySelector('.carousel__image');
    expect(img.getAttribute('src')).toBe('https://example.test/a.jpg');
    expect(img.getAttribute('alt')).toBe('Flat in Quebec');
  });
});
