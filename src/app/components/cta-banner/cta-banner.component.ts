import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cta-banner',
  templateUrl: './cta-banner.component.html',
  styleUrls: ['./cta-banner.component.scss']
})
export class CtaBannerComponent implements OnInit {
  @Input() title: string = 'Ready to scale your revenue?';
  @Input() subtitle: string = 'Get a free, data-driven growth audit from our experts today.';
  @Input() buttonText: string = 'Get Free Audit';
  @Input() buttonLink: string = '/contact';

  constructor() { }

  ngOnInit(): void {
  }
}
