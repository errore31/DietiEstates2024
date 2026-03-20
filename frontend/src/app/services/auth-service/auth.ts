
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth';

  private authState = new BehaviorSubject<boolean>(false);
  public currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.authState.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) {
    this.checkAuth().subscribe();
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        this.authState.next(true);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => this.logoutCleanup(),
      error: () => {
        console.warn("Server irraggiungibile, eseguo logout locale.");
        this.logoutCleanup();
      }
    });
  }

  checkAuth(): Observable<boolean> {
    return this.http.get<{ loggedIn: boolean; user?: User }>(`${this.apiUrl}/session`, { withCredentials: true }).pipe(
      tap(response => {
        if (response.loggedIn && response.user) {
          this.authState.next(true);
          this.currentUserSubject.next(response.user);
        } else {
          this.authState.next(false);
          this.currentUserSubject.next(null);
        }
      }),
      map(response => response.loggedIn),
      catchError(() => {
        this.authState.next(false);
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }

  updateUserState(user: User): void {
    this.currentUserSubject.next(user);
  }

  private logoutCleanup() {
    this.authState.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
    this.toastr.success(`Logout avvenuto con successo, arrivederci!`, 'Logout avvenuto');
  }
}


