import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service/auth';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-widget',
  imports: [RouterModule, CommonModule, FormsModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule],
  templateUrl: './profile-widget.html',
  styleUrl: './profile-widget.scss',
})

export class ProfileWidget {
    isAuthenticated$;
    currentUser$;

    constructor(private authService: AuthService,  private router: Router){
      this.isAuthenticated$ = this.authService.isAuthenticated$;
      this.currentUser$ = this.authService.currentUser$;
    }    

    onLogout(){
      this.authService.logout();
    }

    route(path: string, param?: any) {
      if (param) {
        this.router.navigate([path, param]);
      } else {
        this.router.navigate([path]);
      }
    }

}
