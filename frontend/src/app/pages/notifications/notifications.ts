import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from './notification.service';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

type FilterType = 'all' | 'property' | 'promo';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, Navbar, Footer], 
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
        console.error('Errore durante il recupero delle notifiche:', err);
        this.errorMessage = 'Impossibile caricare le notifiche in questo momento.';
        this.isLoading = false;
      }
    });
  }

  // Metodo chiamato al click sui bottoni della UI per cambiare categoria
  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
  }

  // Getter che applica la logica di filtraggio sulla base del filtro attualmente attivo.
  get filteredNotifications(): AppNotification[] {
    if (this.activeFilter === 'all') {
      return this.notifications;
    }
    return this.notifications.filter(n => n.type === this.activeFilter);
  }
}
