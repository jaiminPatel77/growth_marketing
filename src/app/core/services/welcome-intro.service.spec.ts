import { TestBed } from '@angular/core/testing';
import { WelcomeIntroService } from './welcome-intro.service';

describe('WelcomeIntroService', () => {
  let service: WelcomeIntroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WelcomeIntroService);
  });

  it('should be created with hasPlayed false initially', () => {
    expect(service).toBeTruthy();
    expect(service.hasPlayed()).toBe(false);
  });

  it('should mark played when requested', () => {
    service.markPlayed();
    expect(service.hasPlayed()).toBe(true);
  });

  it('should reset when requested', () => {
    service.markPlayed();
    expect(service.hasPlayed()).toBe(true);
    service.reset();
    expect(service.hasPlayed()).toBe(false);
  });
});

