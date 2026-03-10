import { Component, OnInit, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Searchbar } from '../../shared/searchbar/searchbar';
import { PropertyService } from '../../services/property/property';
import { SearchesService } from '../../services/searches/searches';
import { AuthService } from '../../services/auth-service/auth';
import { Property } from '../../models/property';
import { Card } from '../../shared/card/card';
import { Map } from '../../shared/map/map';

@Component({
  selector: 'app-searches',
  imports: [CommonModule, Searchbar, Card, FormsModule, Map],
  templateUrl: './searches.html',
  styleUrl: './searches.scss',
})
export class Searches implements OnInit {
  constructor(
    private activateRoute: ActivatedRoute,
    private propertyService: PropertyService,
    private searchesService: SearchesService,
    private authService: AuthService
  ) { }

  @ViewChild(Searchbar) searchbarComponent!: Searchbar;

  searchText: string = '';
  properties: Property[] = [];

  // Variabili per lo slider del prezzo
  maxPrice: number = 1000000;
  minRange: number = 50000;
  maxRange: number = 1000000;

  // Oggetto contenente i parametri di ricerca basato sul DB (Properties e PropertiesFeatures)
  searchParams = {
    type: 'Tutte le tipologie',
    roomCount: null as number | null,
    area: null as number | null,
    floor: null as number | null,
    hasElevator: false,
    energyClass: 'Tutte le classi'
  };

  get sliderPercentage(): number {
    return ((this.maxPrice - this.minRange) / (this.maxRange - this.minRange)) * 100;
  }

  onPriceChange(event: any): void {
    this.maxPrice = event.target.value;
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      this.searchText = params['text'] || '';
      this.loadProperties(this.searchText);
    });
  }

  loadProperties(text: string): void {
    if (!text.trim()) {
      // Se il testo è vuoto, carichiamo tutte le proprietà (fallback)
      this.propertyService.getAllProperties().subscribe({
        next: (data) => this.properties = data,
        error: (err) => console.error('Errore nel caricamento totale:', err)
      });
      return;
    }

    this.propertyService.getPropertiesBySearch(text).subscribe({
      next: (data) => {
        this.properties = data;
        console.log('Proprietà trovate per "' + text + '":', this.properties);
        this.saveSearch(text);
      },
      error: (err) => {
        console.error('Errore nel caricamento:', err);
        this.properties = []; // Pulisce la lista in caso di errore (es: rotta non trovata)
      }
    });
  }

  applyFilters(): void {
    if (this.searchbarComponent) {
      this.searchText = this.searchbarComponent.inputText || '';
    }

    const filters: any = {
      text: this.searchText,
      type: this.searchParams.type !== 'Tutte le tipologie' ? this.searchParams.type : null,
      maxPrice: this.maxPrice,
      roomCount: this.searchParams.roomCount,
      area: this.searchParams.area,
      floor: this.searchParams.floor,
      hasElevator: this.searchParams.hasElevator ? true : null,
      energyClass: this.searchParams.energyClass !== 'Tutte le classi' ? this.searchParams.energyClass : null,
    };

    // Rimuove chiavi null o undefined per pulire la richiesta HTTP
    const cleanFilters: any = {};
    for (const key in filters) {
      if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
        cleanFilters[key] = filters[key];
      }
    }

    this.propertyService.getPropertiesByAdvancedSearch(cleanFilters).subscribe({
      next: (data) => {
        this.properties = data;
        console.log('Risultati applicazione filtri:', this.properties);
        this.saveSearch(this.searchText, cleanFilters);
      },
      error: (err) => {
        console.error('Errore durante i filtri:', err);
        this.properties = [];
      }
    });
  }

  saveSearch(text: string, filters?: any): void {
    // Controlla se l'utente è autenticato. Se non lo è, non salviamo la ricerca
    if (!this.authService.currentUserSubject.value) {
      return;
    }

    const criteria: any = {};

    // Primo parametro "area/title" a seconda del testo in input
    if (text && text.trim() !== '') {
      criteria['area/title'] = text.trim();
    }

    // Aggiungo i parametri secondari dalla ricerca
    if (filters) {
      if (filters.maxPrice) criteria['maxPrice'] = filters.maxPrice;
      if (filters.type && filters.type !== 'Tutte le tipologie') criteria['type'] = filters.type;

      // Parametri propertiesFeatures
      if (filters.roomCount) criteria['roomCount'] = filters.roomCount;
      if (filters.area) criteria['area'] = filters.area;
      if (filters.floor) criteria['floor'] = filters.floor;
      if (filters.hasElevator) criteria['hasElevator'] = filters.hasElevator;
      if (filters.energyClass && filters.energyClass !== 'Tutte le classi') criteria['energyClass'] = filters.energyClass;
    }

    // Salva la ricerca se almeno un campo è valorizzato
    if (Object.keys(criteria).length > 0) {
      this.searchesService.createSearch(criteria).subscribe({
        next: (res) => console.log('Ricerca salvata con successo:', res),
        error: (err) => console.error('Errore durante il salvataggio della ricerca', err)
      });
    }
  }
}