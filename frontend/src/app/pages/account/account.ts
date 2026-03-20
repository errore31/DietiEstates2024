import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth-service/auth';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user/user';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user';



@Component({
  selector: 'app-account',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account implements OnInit {

  currentUser: User | null = null;
  formPassword: boolean = false;

  editUser: any = {
    name: '',
    surname: '',
    username: '',
    email: '',
    oldPassword: '',
    newPassword: ''
  };

  constructor(private authService: AuthService, private userService: UserService,
    private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(
      user => {
        if (user) {
          this.currentUser = user;

          this.editUser = {
            name: user.name,
            surname: user.surname,
            username: user.username,
            email: user.email,
          };
        }
      });
  }

  saveProfile() {

    if (!this.currentUser || !this.currentUser.id) {
      return;
    }

    if (!this.editUser.name || !this.editUser.surname || !this.editUser.username || !this.editUser.email) {
      this.toastr.error('I campi nome, cognome, username ed email sono obbligatori.', 'Attenzione');
      return;
    }


    this.userService.updateUser(this.currentUser.id, this.editUser).subscribe({
      next: (response: any) => {
        // Aggiorniamo l'utente locale
        this.currentUser = { ...this.currentUser!, ...this.editUser };

        // Sincronizziamo lo stato globale in AuthService
        this.authService.updateUserState(this.currentUser!);

        this.router.navigate(['/account']);
        this.toastr.success('Profilo aggiornato con successo!');
        this.formPassword = false;
        this.editUser.oldPassword = '';
        this.editUser.newPassword = '';
        this.editUser = {
          name: this.editUser.name,
          surname: this.editUser.surname,
          username: this.editUser.username,
          email: this.editUser.email,
        };
      },
      error: (error) => {
        console.error('Error updating profile:', error.error);

        if (error.status === 400 && error.error?.error && Array.isArray(error.error.error)) {
          error.error.error.forEach((errItem: any) => {
            this.toastr.error(errItem.msg, 'Errore di Validazione');
          });
        }
        else if (error.status === 400 && error.error.message == 'Errore nella validazione degli input') {
          this.toastr.error('Errore nella validazione degli input', 'Errore di aggiornamento');
        }
        else if (error.status === 400) {
          this.toastr.error('La vecchia password non è corretta', 'Errore di aggiornamento');
        }
        else {
          this.toastr.error('Si è verificato un errore durante l\'aggiornamento del profilo. Riprova più tardi.');
        }
      }
    });
  }

  enablePassword() {
    this.formPassword = !this.formPassword;

    if (!this.formPassword) {
      this.editUser.oldPassword = '';
      this.editUser.newPassword = '';
    }

  }

}
