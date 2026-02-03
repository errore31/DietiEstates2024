import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-profile-widget',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './profile-widget.html',
  styleUrl: './profile-widget.scss',
})
export class ProfileWidget {
    isAuthenticated$;
    currentUser$;

    constructor(private authService: AuthService){
      this.isAuthenticated$ = this.authService.isAuthenticated$;
      this.currentUser$ = this.authService.currentUser$;
    }    

    onLogout(){
      this.authService.logout();
    }
}
