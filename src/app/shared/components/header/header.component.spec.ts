import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create header component', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should toggle mobile menu', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const comp = fixture.componentInstance;
    expect(comp.isMenuOpen()).toBe(false);
    comp.toggleMenu();
    expect(comp.isMenuOpen()).toBe(true);
    comp.closeMenu();
    expect(comp.isMenuOpen()).toBe(false);
  });

  it('should close mobile menu on escape key', () => {
    const fixture = TestBed.createComponent(HeaderComponent);
    const comp = fixture.componentInstance;
    comp.isMenuOpen.set(true);
    comp.onEscape();
    expect(comp.isMenuOpen()).toBe(false);
  });
});

