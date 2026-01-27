import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { Searchbar } from '../../shared/searchbar/searchbar';
@Component({
  selector: 'app-home',
  imports: [Navbar, Searchbar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
