import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-notification-card',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './notification-card.html',
  styleUrl: './notification-card.css'
})
export class NotificationCard {
  faBell = faBell;
  faCircleExclamation = faCircleExclamation;

  constructor(public notification: NotificationService) {}

  get isVisible() {
    return this.notification.message();
  }

  get isSuccess() {
    return this.notification.type() === 'success';
  }

  get isError() {
    return this.notification.type() === 'error';
  }
}
