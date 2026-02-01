import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { Searchbar } from '../../shared/searchbar/searchbar';
import { Footer } from '../../shared/footer/footer';
import { Card } from '../../shared/card/card';

@Component({
  selector: 'app-home',
  imports: [Navbar, Searchbar, Footer, Card],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
