import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; 

   constructor(private http: HttpClient, private router: Router) {}

   login(credentials: any): Observable<any> {
    // Invia i dati al backend 
    return this.http.post(`${this.apiUrl}`, credentials, {withCredentials: true});
  }

  //fare funzione logout

  //fare funzione che recupera la sessione

}
