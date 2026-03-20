import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Searchbar } from '../../shared/searchbar/searchbar';
import { PropertyService } from '../../services/property/property';
import { SearchesService } from '../../services/searches/searches';
import { AuthService } from '../../services/auth-service/auth';
import { Property } from '../../models/property';
import { Card } from '../../shared/card/card';
import { Map } from '../../shared/map/map';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-searches',
  imports: [CommonModule, Searchbar, Card, FormsModule, Map],
  templateUrl: './searches.html',
  styleUrl: './searches.scss',
})
export class Searches implements OnInit, AfterViewInit {
  constructor(
    private activateRoute: ActivatedRoute,
    private propertyService: PropertyService,
    private searchesService: SearchesService,
    private authService: AuthService
  ) { }

  @ViewChild(Searchbar) searchbarComponent!: Searchbar;

  searchText: string = '';
  properties: Property[] = [];

  ngOnInit(): void {
    combineLatest([
      this.activateRoute.params,
      this.activateRoute.queryParams
    ]).subscribe(([params, queryParams]) => {
      this.searchText = params['text'] || '';

      const bboxParams: any = {};
      if (queryParams['bboxLon1']) bboxParams.bboxLon1 = queryParams['bboxLon1'];
      if (queryParams['bboxLat1']) bboxParams.bboxLat1 = queryParams['bboxLat1'];
      if (queryParams['bboxLon2']) bboxParams.bboxLon2 = queryParams['bboxLon2'];
      if (queryParams['bboxLat2']) bboxParams.bboxLat2 = queryParams['bboxLat2'];

      const filters: any = {
        text: this.searchText,
        type: queryParams['type'] || null,
        maxPrice: queryParams['maxPrice'] ? Number(queryParams['maxPrice']) : null,
        roomCount: queryParams['roomCount'] ? Number(queryParams['roomCount']) : null,
        area: queryParams['area'] ? Number(queryParams['area']) : null,
        floor: queryParams['floor'] ? Number(queryParams['floor']) : null,
        hasElevator: queryParams['hasElevator'] === 'true' ? true : null,
        energyClass: queryParams['energyClass'] || null,
        ...bboxParams
      };

      const cleanFilters: any = {};
      for (const key in filters) {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          cleanFilters[key] = filters[key];
        }
      }

      const hasBbox = Object.keys(bboxParams).length > 0;
      const hasAdvancedFilters = Object.keys(cleanFilters).length > 1 || queryParams['maxPrice'];

      if (hasAdvancedFilters || hasBbox) {
        this.propertyService.getPropertiesByAdvancedSearch(cleanFilters).subscribe({
          next: (data) => {
            this.properties = data;
            this.saveSearch(this.searchText, cleanFilters);
          },
          error: (err) => {
            this.properties = [];
          }
        });
      } else {
        this.loadProperties(this.searchText);
      }
    });
  }

  ngAfterViewInit() {
    combineLatest([
      this.activateRoute.params,
      this.activateRoute.queryParams
    ]).subscribe(([params, queryParams]) => {
      if (this.searchbarComponent) {
        setTimeout(() => {
          this.searchbarComponent.inputText = params['text'] || '';

          if (queryParams['type']) this.searchbarComponent.searchParams.type = queryParams['type'];
          if (queryParams['maxPrice']) this.searchbarComponent.maxPrice = Number(queryParams['maxPrice']);
          if (queryParams['roomCount']) this.searchbarComponent.searchParams.roomCount = Number(queryParams['roomCount']);
          if (queryParams['area']) this.searchbarComponent.searchParams.area = Number(queryParams['area']);
          if (queryParams['floor']) this.searchbarComponent.searchParams.floor = Number(queryParams['floor']);
          if (queryParams['hasElevator']) this.searchbarComponent.searchParams.hasElevator = queryParams['hasElevator'] === 'true';
          if (queryParams['energyClass']) this.searchbarComponent.searchParams.energyClass = queryParams['energyClass'];
        }, 0);
      }
    });
  }

  loadProperties(text: string): void {
    if (!text.trim()) {
      this.propertyService.getAllProperties().subscribe({
        next: (data) => this.properties = data,
        error: (err) => console.error('Errore nel caricamento totale:', err)
      });
      return;
    }

    this.propertyService.getPropertiesBySearch(text).subscribe({
      next: (data) => {
        this.properties = data;
        this.saveSearch(text);
      },
      error: (err) => {
        this.properties = [];
      }
    });
  }

  saveSearch(text: string, filters?: any): void {
    if (!this.authService.currentUserSubject.value) {
      return;
    }

    const criteria: any = {};
    if (text && text.trim() !== '') {
      criteria['area/title'] = text.trim();
    }

    if (filters) {
      if (filters.maxPrice) criteria['maxPrice'] = filters.maxPrice;
      if (filters.type && filters.type !== 'Tutte le tipologie') criteria['type'] = filters.type;
      if (filters.roomCount) criteria['roomCount'] = filters.roomCount;
      if (filters.area) criteria['area'] = filters.area;
      if (filters.floor) criteria['floor'] = filters.floor;
      if (filters.hasElevator) criteria['hasElevator'] = filters.hasElevator;
      if (filters.energyClass && filters.energyClass !== 'Tutte le classi') criteria['energyClass'] = filters.energyClass;
    }

    if (Object.keys(criteria).length > 0) {
      this.searchesService.createSearch(criteria).subscribe({
        next: (res) => console.log('Ricerca salvata con successo:', res),
        error: (err) => console.error('Errore durante il salvataggio della ricerca', err)
      });
    }
  }
}