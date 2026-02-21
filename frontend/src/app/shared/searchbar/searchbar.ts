import { Component, inject } from '@angular/core';
import { GeoapifyService, GeoapifyResponse } from '../../services/geoapify/geoapify';

@Component({
  selector: 'app-searchbar',
  imports: [],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.scss',
})
export class Searchbar {
  private geoService = inject(GeoapifyService);


  suggestion(event: Event) {
    const valore = (event.target as HTMLInputElement).value;
    this.geoService.getAutocomplete(valore).subscribe({
      next: (res) => console.log(res.results),
      error: (err) => console.error(err)
    });;

  }
}