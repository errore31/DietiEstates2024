import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Footer } from '../../shared/footer/footer';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [Footer, FormsModule, CommonModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  registerData: any = {
    name: '',
    surname: '',
    username: '',
    email: '',
    password: ''
  };

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  onRegister() {
    if (!this.registerData.name || !this.registerData.surname || !this.registerData.username || !this.registerData.email || !this.registerData.password) {
      this.toastr.error('Per favore, compila tutti i campi.', 'Attenzione');
      return;
    }
    this.userService.createUser(this.registerData).subscribe({
      next: () => {
        this.toastr.success('Effettua il login.', 'Registrazione riuscita');
        this.router.navigate(['/auth']);
      },
      error: (error) => {
        console.error('Errore registrazione:', error);

        if (error.status === 400 && error.error?.error && Array.isArray(error.error.error)) {
          error.error.error.forEach((errItem: any) => {
            this.toastr.error(errItem.msg, 'Errore di Validazione');
          });
        }
        else if (error.status === 400 && error.error?.message === 'Errore nella validazione degli input') {
          this.toastr.error('Errore nella validazione degli input', 'Errore');
        }
        else if (error.status === 409) {
          this.toastr.error('Username o email già utilizzati', 'Errore di registrazione');
        } else {
          this.toastr.error('Si è verificato un errore. Riprova più tardi.', 'Errore di sistema');
        }
      }
    });
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:3000/auth/google';
  }
}