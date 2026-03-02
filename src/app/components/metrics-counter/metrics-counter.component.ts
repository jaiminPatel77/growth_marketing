import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-metrics-counter',
  templateUrl: './metrics-counter.component.html',
  styleUrls: ['./metrics-counter.component.scss']
})
export class MetricsCounterComponent implements OnInit {
  @Input() target: number = 100;
  @Input() prefix: string = '';
  @Input() suffix: string = '%';
  @Input() label: string = 'Metric';
  
  currentValue: number = 0;

  ngOnInit() {
    this.animateValue();
  }

  animateValue() {
    const duration = 2000;
    const steps = 60;
    const stepTime = Math.abs(Math.floor(duration / steps));
    const increment = this.target / steps;

    const timer = setInterval(() => {
      this.currentValue += increment;
      if (this.currentValue >= this.target) {
        this.currentValue = this.target;
        clearInterval(timer);
      }
    }, stepTime);
  }
}
