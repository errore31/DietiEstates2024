import { Component } from '@angular/core';
import { ProfileWidget } from '../../shared/profile-widget/profile-widget';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [ProfileWidget],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

  constructor(private router: Router) { }

  navigateToHome() {
    this.router.navigate(['/']);
  }
}
