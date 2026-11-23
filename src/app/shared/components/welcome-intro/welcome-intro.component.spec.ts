import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WelcomeIntroComponent } from './welcome-intro.component';
import { WelcomeIntroService } from '../../../core/services/welcome-intro.service';

describe('WelcomeIntroComponent', () => {
  let introService: WelcomeIntroService;
  let fixture: ComponentFixture<WelcomeIntroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeIntroComponent],
      providers: [WelcomeIntroService]
    }).compileComponents();

    introService = TestBed.inject(WelcomeIntroService);
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create the welcome intro component', () => {
    fixture = TestBed.createComponent(WelcomeIntroComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should be active on initial fresh load', () => {
    fixture = TestBed.createComponent(WelcomeIntroComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isActive()).toBe(true);
  });

  it('should not be active if introService reports hasPlayed is true', () => {
    introService.markPlayed();
    fixture = TestBed.createComponent(WelcomeIntroComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.isActive()).toBe(false);
  });

  it('should finish intro on skipIntro', () => {
    fixture = TestBed.createComponent(WelcomeIntroComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;
    comp.skipIntro();
    expect(comp.isFadingOut()).toBe(true);
  });

  it('should show "Enable Sound" if unmuted autoplay is blocked', () => {
    fixture = TestBed.createComponent(WelcomeIntroComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;

    // Simulate blocked autoplay
    comp.isAudible.set(false);
    comp.audioAutoplayBlocked.set(true);

    expect(comp.audioButtonLabel()).toBe('Enable Sound');
    expect(comp.isMuted()).toBe(true);
  });

  it('should show "Mute" when sound is actively playing', () => {
    fixture = TestBed.createComponent(WelcomeIntroComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;

    // Simulate active unmuted playback
    comp.isAudible.set(true);
    comp.audioAutoplayBlocked.set(false);

    expect(comp.audioButtonLabel()).toBe('Mute');
    expect(comp.isMuted()).toBe(false);
  });

  it('should enable sound when toggleSound is called from muted/blocked state', () => {
    fixture = TestBed.createComponent(WelcomeIntroComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;

    // Initially blocked / muted
    comp.isAudible.set(false);
    comp.audioAutoplayBlocked.set(true);

    // Click "Enable Sound"
    comp.toggleSound();

    expect(comp.isAudible()).toBe(true);
    expect(comp.audioAutoplayBlocked()).toBe(false);
    expect(comp.audioButtonLabel()).toBe('Mute');
    expect(comp.isMuted()).toBe(false);
  });

  it('should mute sound when toggleSound is called while audible', () => {
    fixture = TestBed.createComponent(WelcomeIntroComponent);
    fixture.detectChanges();
    const comp = fixture.componentInstance;

    // Playing with sound
    comp.isAudible.set(true);
    comp.audioAutoplayBlocked.set(false);

    // Click "Mute"
    comp.toggleSound();

    expect(comp.isAudible()).toBe(false);
    expect(comp.audioButtonLabel()).toBe('Unmute');
    expect(comp.isMuted()).toBe(true);
  });
});
