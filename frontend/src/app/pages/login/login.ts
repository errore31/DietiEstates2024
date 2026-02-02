import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; 
import { ToastrService } from 'ngx-toastr'; 
import { Footer } from '../../shared/footer/footer';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [Footer, FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  // Oggetto per il binding dei campi
  loginData = {
    username: '',
    password: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private toastr: ToastrService 
  ) { }

  onLogin() {
    console.log('Dati inviati:', this.loginData);
    // Qui chiamerai il tuo service per fare il login al backend
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.router.navigate(['/']); // vai in home se login OK
        this.toastr.success(`Bentornat* ${this.loginData.username}!`, 'Accesso riuscito');
      },
      error: () => {
        this.toastr.error('Credenziali non valide, riprova.', 'Errore di accesso');
        this.loginData.password = '';
      }

    });
  }

  loginWithGoogle() {
    // Qui inserisci la logica di inizializzazione Google che abbiamo discusso
    console.log('Avvio login Google...');
  }
}
