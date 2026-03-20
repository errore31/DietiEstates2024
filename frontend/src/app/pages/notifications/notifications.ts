import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from './notification.service';

type FilterType = 'all' | 'property' | 'promo';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {
  private notificationService = inject(NotificationService);

  notifications: AppNotification[] = [];
  activeFilter: FilterType = 'all';
  isLoading = true;
  errorMessage = '';

  ngOnInit(): void {
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.isLoading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Impossibile caricare le notifiche in questo momento.';
        this.isLoading = false;
      }
    });
  }

  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
  }

  get filteredNotifications(): AppNotification[] {
    if (this.activeFilter === 'all') {
      return this.notifications;
    }
    return this.notifications.filter(n => n.type === this.activeFilter);
  }
}
