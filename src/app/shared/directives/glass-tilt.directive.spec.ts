import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlassTiltDirective } from './glass-tilt.directive';

@Component({
  standalone: true,
  imports: [GlassTiltDirective],
  template: `<div class="test-card" appGlassTilt>Card Content</div>`
})
class TestHostComponent {}

describe('GlassTiltDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
  });

  it('should create test host with directive applied', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });
});

