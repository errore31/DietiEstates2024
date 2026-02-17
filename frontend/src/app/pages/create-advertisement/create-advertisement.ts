import { Component } from '@angular/core';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-create-advertisement',
  imports: [Navbar, Footer],
  templateUrl: './create-advertisement.html',
  styleUrl: './create-advertisement.scss',
})
export class CreateAdvertisement {

}
