
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

   /**
   * SCELTA TECNICA: BehaviorSubject invece di semplici booleani.
   * A differenza di una variabile normale, il BehaviorSubject "emette" il valore a chiunque sia iscritto.
   * Se la Navbar si iscrive a 'isAuthenticated$', riceverà l'aggiornamento istantaneo 
   * non appena chiamiamo .next(true) dopo il login, senza ricaricare la pagina.
   */
  private authState = new BehaviorSubject<boolean>(false);
  public currentUserSubject = new BehaviorSubject<User | null>(null);

  // Esposizione degli Observable: i componenti usano questi per "ascoltare" i cambiamenti
  // Il simbolo $ è una convenzione per indicare uno stream di dati (RxJS)
  isAuthenticated$ = this.authState.asObservable(); //quando si modifica authState allora modifica questa variabile
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router,  private toastr: ToastrService ) {
    /**
     * GESTIONE REFRESH (F5): 
     * Angular è una Single Page Application; se l'utente preme F5, la memoria viene cancellata.
     * Chiamando checkAuth() nel costruttore, garantiamo che l'app chieda subito al server
     * se esiste un cookie di sessione valido prima di mostrare la UI all'utente.
     */
    this.checkAuth().subscribe();
  }

   login(credentials: any): Observable<any> {
    // Invia i dati al backend 
    return this.http.post<any>(`${this.apiUrl}`, credentials, { withCredentials: true }).pipe(
        tap(response => {
          // Aggiorniamo lo stato globale: la "radio" trasmette i nuovi dati a tutti i componenti
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
        // In caso di errore (es. server offline), forziamo lo stato a 'non autenticato'
        this.authState.next(false);
        this.currentUserSubject.next(null);
        return of(false);
      })
    );
  }

  private logoutCleanup() {
    // Reset dello stato e redirect: riportiamo l'app allo stato "vergine"
    this.authState.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
    this.toastr.success(`Logout avvenuto con successo, arrivederci!`, 'Logout avvenuto');
  }
}


