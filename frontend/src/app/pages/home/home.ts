import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../shared/navbar/navbar';
import { Searchbar } from '../../shared/searchbar/searchbar';
import { Footer } from '../../shared/footer/footer';
import { Card } from '../../shared/card/card';
import { PropertyService } from '../../services/property/property';
import { Map } from '../../shared/map/map';

import { Property } from '../../models/property';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Navbar, Map, Searchbar, Footer, Card],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  properties: Property[] = [];
  position: { lat: number, lng: number } | null = null;

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (data) => {
        this.properties = data;
        console.log('Proprietà caricate:', this.properties);
      },
      error: (err) => console.error('Errore nel caricamento:', err)
    });
  }

  onLocationSelected(event: { lat: number, lng: number }) {
    if (!this.position) {
      this.position = { lat: 0, lng: 0 };
    }
    this.position.lat = event.lat;
    this.position.lng = event.lng;
  }
}
