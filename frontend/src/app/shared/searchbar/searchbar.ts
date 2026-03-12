import { Component, inject, Output, EventEmitter, OnInit } from '@angular/core';
import { Geoapify } from '../../services/geoapify/geoapify';
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

  // Variabili per i suggerimenti
  recentSearches: any[] = [];
  locationSuggestions: string[] = [];

  // Variabili per lo slider del prezzo
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

    // Per gestire il focus inziale
    if (this.authService.currentUserSubject.value) {
      this.loadRecentSearches();
    }
  }

  loadRecentSearches() {
    this.searchesService.getSearches().subscribe({
      next: (data) => {
        // Prendi le ultime 3 inserite in ordine decrescente, filtrando per quelle che hanno una text/title (area/title)
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
    // Ritardo per permettere il click sul menu a tendina prima che sparisca
    setTimeout(() => {
      this.isInputFocused = false;
    }, 200);
  }

  suggestion(event: Event) {
    const valore = (event.target as HTMLInputElement).value;
    this.inputText = valore;

    if (!valore.trim()) {
      this.locationSuggestions = [];
      return;
    }

    this.geoService.getAutocomplete(valore).subscribe({
      next: (res) => {
        const uniqueSuggestions = new Set<string>();
        for (const result of res.results) {
          if (result.formatted) {
            uniqueSuggestions.add(result.formatted);
          }
        }
        this.locationSuggestions = Array.from(uniqueSuggestions);
      },
      error: (err) => console.error(err)
    });
  }

  selectSuggestion(suggestion: string) {
    this.inputText = suggestion;
    this.isInputFocused = false;
    // this.goToSearch(); // Optional: do we automatically search upon clicking?
  }

  selectRecentSearch(search: any) {
    this.inputText = search.criteria['area/title'];

    // Ripristiniamo anche eventuali filtri se presenti
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
    this.applyFilters(); // Usiamo applyFilters per assicurare che vengano considerati i filtri avanzati
  }

  onPriceChange(event: any): void {
    this.maxPrice = event.target.value;
  }

  toggleFilters() {
    this.isFiltersOpen = !this.isFiltersOpen;
    // Se apriamo i filtri, chiudiamo i suggerimenti
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

    // Validazioni per i filtri numerici
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

    // Prepara i query parameters per passare lo stato, omettendo i valori di default per pulizia URL
    const queryParams: any = {};
    if (this.searchParams.type !== 'Tutte le tipologie') queryParams.type = this.searchParams.type;
    if (this.maxPrice !== 1000000) queryParams.maxPrice = this.maxPrice;
    if (this.searchParams.roomCount) queryParams.roomCount = this.searchParams.roomCount;
    if (this.searchParams.area) queryParams.area = this.searchParams.area;
    if (this.searchParams.floor) queryParams.floor = this.searchParams.floor;
    if (this.searchParams.hasElevator) queryParams.hasElevator = true;
    if (this.searchParams.energyClass !== 'Tutte le classi') queryParams.energyClass = this.searchParams.energyClass;

    this.router.navigate(['/searches', this.inputText], { queryParams });
  }

  applyFilters() {
    this.isFiltersOpen = false;
    this.goToSearch();
  }
}