import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsCounterComponent } from './metrics-counter.component';

describe('MetricsCounterComponent', () => {
  let component: MetricsCounterComponent;
  let fixture: ComponentFixture<MetricsCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsCounterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
