import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Definizione dell'interfaccia per il tipo di dato
export interface GeoapifyResponse {
  results: Array<{
    formatted: string;
    lat: number;
    lon: number;
    place_id: string;
  }>;
}

@Injectable({
  providedIn: 'root' // Rende il servizio disponibile in tutta l'app
})
export class GeoapifyService {
  private readonly apiKey = 'YOUR_API_KEY';
  private readonly baseUrl = 'https://api.geoapify.com/v1/geocode/autocomplete';

  constructor(private http: HttpClient) {}

  getAutocomplete(text: string): Observable<GeoapifyResponse> {
    // Usiamo HttpParams per gestire i parametri dell'URL in modo pulito
    const params = new HttpParams()
      .set('text', text)
      .set('limit', '5')
      .set('format', 'json')
      .set('apiKey', this.apiKey);

    return this.http.get<GeoapifyResponse>(this.baseUrl, { params });
  }
}