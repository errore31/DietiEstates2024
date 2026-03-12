import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth-service/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  // Oggetto per il binding dei campi
  loginData = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'email_exists') {
        this.toastr.error('C\'è già un account associato a questa email.', 'Email già registrata');
      } else if (params['error'] === 'auth_failed') {
        this.toastr.error('Autenticazione con Google fallita.', 'Errore Google Auth');
      } else if (params['error'] === 'server_error') {
        this.toastr.error('Errore del server durante l\'autenticazione.', 'Errore Google Auth');
      }
    });
  }

  onLogin() {
    if (!this.loginData.username || !this.loginData.password) {
      this.toastr.error('Per favore, compila tutti i campi.', 'Attenzione');
      return;
    }

    console.log('Dati inviati:', this.loginData);
    // Qui chiamerai il tuo service per fare il login al backend
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/']); // vai in home se login OK
        this.toastr.success(`Bentornat* ${this.loginData.username}!`, 'Accesso riuscito');
      },
      error: (error) => {
        if (error.status === 400 && error.error?.error && Array.isArray(error.error.error)) {
          error.error.error.forEach((errItem: any) => {
            this.toastr.error(errItem.msg, 'Errore di Validazione');
          });
        }
        else {
          this.toastr.error('Credenziali non valide, riprova.', 'Errore di accesso');
        }

        this.loginData.password = '';
      }
    });
  }

  loginWithGoogle() {
    // Reindirizziamo direttamente al backend, sarà lui a gestire Google
    window.location.href = 'http://localhost:3000/auth/google';
  }
}
