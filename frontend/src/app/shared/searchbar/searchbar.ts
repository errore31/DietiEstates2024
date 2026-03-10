import { Component, inject } from '@angular/core';
import { Geoapify } from '../../services/geoapify/geoapify';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-searchbar',
  imports: [FormsModule],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.scss',
})
export class Searchbar {
  private geoService = inject(Geoapify);
  inputText = '';
  public locationOptions: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer, private router: Router) { }

  suggestion(event: Event) {
    const valore = (event.target as HTMLInputElement).value;
    this.inputText = valore;
    let options = '';
    this.geoService.getAutocomplete(valore).subscribe({
      //next: (res) => {console.log(res.results)},
      next: (res) => {
        for (const result of res.results) {
          //console.log(result.address_line1);
          options += '<option value="' + result.formatted + '">' + result.formatted + '</option>'
        };

        const rawHTML = options;
        this.locationOptions = this.sanitizer.bypassSecurityTrustHtml(rawHTML);
      },
      error: (err) => console.error(err)
    });;

  }

  goToSearch() {
    //console.log(this.inputText)
    this.router.navigate(['/searches', this.inputText]);
  }
}