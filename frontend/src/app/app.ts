import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { CommonModule } from '@angular/common';
import { NotificationCard } from './components/notification-card/notification-card';

@Component({
  selector: 'app-root',
  imports: [CommonModule ,RouterOutlet, Header, Footer, NotificationCard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  get isLoginPage() {
    return this.router.url === '/auth/log-in';
  }

  get isResetPassword(){
    return this.router.url === '/technical-support';
  }

  constructor(private router: Router) { }
}
