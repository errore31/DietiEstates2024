import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { Geoapify, GeoapifyBbox } from '../../services/geoapify/geoapify';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SearchesService } from '../../services/searches/searches';
import { AuthService } from '../../services/auth-service/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-searchbar',
  imports: [FormsModule, CommonModule],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.scss',
})
export class Searchbar implements OnInit {
  private geoService = inject(Geoapify);
  private searchesService = inject(SearchesService);
  private authService = inject(AuthService);
  private toastr: ToastrService = inject(ToastrService);

  inputText = '';

  isFiltersOpen = false;
  isInputFocused = false;

  recentSearches: any[] = [];
  locationSuggestions: string[] = [];

  private suggestionBboxMap: Map<string, GeoapifyBbox | null> = new Map();
  selectedBbox: GeoapifyBbox | null = null;

  maxPrice: number = 1000000;
  minRange: number = 50000;
  maxRange: number = 2000000;

  @Output() searchApplied = new EventEmitter<any>();

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

  constructor(private router: Router) { }

  ngOnInit() {
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.loadRecentSearches();
      } else {
        this.recentSearches = [];
      }
    });

    if (this.authService.currentUserSubject.value) {
      this.loadRecentSearches();
    }
  }

  loadRecentSearches() {
    this.searchesService.getSearches().subscribe({
      next: (data) => {
        this.recentSearches = data
          .filter(s => s.criteria && s.criteria['area/title'])
          .reverse()
          .slice(0, 3);
      },
      error: (err) => console.error("Errore recupero ricerche recenti", err)
    });
  }

  onInputFocus() {
    this.isInputFocused = true;
  }

  onInputBlur() {
    setTimeout(() => {
      this.isInputFocused = false;
    }, 200);
  }

  suggestion(event: Event) {
    const valore = (event.target as HTMLInputElement).value;
    this.inputText = valore;
    this.selectedBbox = null;

    if (!valore.trim()) {
      this.locationSuggestions = [];
      return;
    }

    this.geoService.getAutocomplete(valore).subscribe({
      next: (res) => {
        const uniqueSuggestions = new Set<string>();
        this.suggestionBboxMap.clear();
        for (const result of res.results) {
          if (result.formatted) {
            if (!uniqueSuggestions.has(result.formatted)) {
              uniqueSuggestions.add(result.formatted);
              this.suggestionBboxMap.set(result.formatted, result.bbox || null);
            }
          }
        }
        this.locationSuggestions = Array.from(uniqueSuggestions);
      },
      error: (err) => console.error(err)
    });
  }

  selectSuggestion(suggestion: string) {
    this.inputText = suggestion;
    this.selectedBbox = this.suggestionBboxMap.get(suggestion) || null;
    this.isInputFocused = false;
  }

  selectRecentSearch(search: any) {
    this.inputText = search.criteria['area/title'];
    this.selectedBbox = null;
    if (search.criteria) {
      this.searchParams.type = search.criteria.type || 'Tutte le tipologie';
      this.maxPrice = search.criteria.maxPrice || 1000000;
      this.searchParams.roomCount = search.criteria.roomCount || null;
      this.searchParams.area = search.criteria.area || null;
      this.searchParams.floor = search.criteria.floor || null;
      this.searchParams.hasElevator = search.criteria.hasElevator === true;
      this.searchParams.energyClass = search.criteria.energyClass || 'Tutte le classi';
    }

    this.isInputFocused = false;
    this.applyFilters();
  }

  onPriceChange(event: any): void {
    this.maxPrice = event.target.value;
  }

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
    if (this.isFiltersOpen) {
      this.isInputFocused = false;
    }
  }

  resetFilters() {
    this.searchParams = {
      type: 'Tutte le tipologie',
      roomCount: null,
      area: null,
      floor: null,
      hasElevator: false,
      energyClass: 'Tutte le classi'
    };
    this.maxPrice = 1000000;
  }

  goToSearch() {
    if (!this.inputText.trim()) {
      this.toastr.error('Inserisci una località per iniziare la ricerca.', 'Campo mancante');
      return;
    }

    if (this.searchParams.roomCount !== null && (this.searchParams.roomCount < 0 || this.searchParams.roomCount > 100)) {
      this.toastr.error('Il numero di stanze deve essere compreso tra 0 e 100.', 'Valore non valido');
      return;
    }

    if (this.searchParams.area !== null && (this.searchParams.area < 1 || this.searchParams.area > 100000)) {
      this.toastr.error('L\'area deve essere compresa tra 1 e 100.000 m².', 'Valore non valido');
      return;
    }

    if (this.searchParams.floor !== null && (this.searchParams.floor < -10 || this.searchParams.floor > 200)) {
      this.toastr.error('Il piano deve essere compreso tra -10 e 200.', 'Valore non valido');
      return;
    }

    this.isInputFocused = false;
    this.searchApplied.emit();

    const queryParams: any = {};
    if (this.searchParams.type !== 'Tutte le tipologie') queryParams.type = this.searchParams.type;
    if (this.maxPrice !== 1000000) queryParams.maxPrice = this.maxPrice;
    if (this.searchParams.roomCount) queryParams.roomCount = this.searchParams.roomCount;
    if (this.searchParams.area) queryParams.area = this.searchParams.area;
    if (this.searchParams.floor) queryParams.floor = this.searchParams.floor;
    if (this.searchParams.hasElevator) queryParams.hasElevator = true;
    if (this.searchParams.energyClass !== 'Tutte le classi') queryParams.energyClass = this.searchParams.energyClass;

    if (this.selectedBbox) {
      queryParams.bboxLon1 = this.selectedBbox.lon1;
      queryParams.bboxLat1 = this.selectedBbox.lat1;
      queryParams.bboxLon2 = this.selectedBbox.lon2;
      queryParams.bboxLat2 = this.selectedBbox.lat2;
    }

    this.router.navigate(['/searches', this.inputText], { queryParams });
  }

  applyFilters() {
    this.isFiltersOpen = false;
    this.goToSearch();
  }
}