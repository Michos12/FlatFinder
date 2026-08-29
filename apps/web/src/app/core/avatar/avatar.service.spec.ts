import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AvatarService } from './avatar.service';

describe('AvatarService', () => {
  let service: AvatarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarService);
  });

  describe('isValid', () => {
    it('accepts http and https URLs', () => {
      expect(service.isValid('https://example.test/face.jpg')).toBe(true);
      expect(service.isValid('http://example.test/face.jpg')).toBe(true);
    });

    it('rejects schemes that are not http(s)', () => {
      // The value ends up in an <img src>, so javascript: and data: have no
      // business being accepted here.
      expect(service.isValid('javascript:alert(1)')).toBe(false);
      expect(service.isValid('data:image/png;base64,AAAA')).toBe(false);
      expect(service.isValid('ftp://example.test/face.jpg')).toBe(false);
    });

    it('rejects anything that is not a URL at all', () => {
      expect(service.isValid('assets/houses/house.jpg')).toBe(false);
      expect(service.isValid('')).toBe(false);
    });
  });

  describe('resolve', () => {
    it('trims and returns a valid URL', async () => {
      await expect(
        firstValueFrom(service.resolve('  https://example.test/face.jpg  ')),
      ).resolves.toBe('https://example.test/face.jpg');
    });

    it('treats an empty value as "remove the picture"', async () => {
      await expect(firstValueFrom(service.resolve('   '))).resolves.toBe('');
    });

    it('fails on an invalid URL', async () => {
      await expect(firstValueFrom(service.resolve('javascript:alert(1)'))).rejects.toThrow(
        'Enter a valid http(s) image URL',
      );
    });
  });

  describe('initialsOf', () => {
    it('builds uppercase initials from both names', () => {
      expect(service.initialsOf('michael', 'veliz')).toBe('MV');
    });

    it('copes with a missing last name', () => {
      expect(service.initialsOf('Michael', '')).toBe('M');
    });
  });
});
