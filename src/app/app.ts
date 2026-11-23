import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { WelcomeIntroComponent } from './shared/components/welcome-intro/welcome-intro.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    WelcomeIntroComponent,
    HeaderComponent,
    RouterOutlet,
    FooterComponent,
    ToastComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
