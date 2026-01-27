import { Component } from '@angular/core';
import { ProfileWidget } from '../../shared/profile-widget/profile-widget';

@Component({
  selector: 'app-navbar',
  imports: [ProfileWidget],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

}
