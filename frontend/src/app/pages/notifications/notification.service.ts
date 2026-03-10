import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  type: 'property' | 'promo';
  date: string | Date;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  // Puntiamo direttamente al backend Express locale
  private apiUrl = 'http://localhost:3000/notifications/get';

  getNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(this.apiUrl);
  }
}
