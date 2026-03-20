import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

export interface GeoapifyBbox {
  lon1: number;
  lat1: number;
  lon2: number;
  lat2: number;
}

export interface GeoapifyResponse {
  results: Array<{
    address_line1: string;
    formatted: string;
    lat: number;
    lon: number;
    place_id: string;
    bbox: GeoapifyBbox | null;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class Geoapify {
  private readonly apiUrl = `http://localhost:3000/searches`;

  constructor(private http: HttpClient) { }

  getAutocomplete(text: string): Observable<GeoapifyResponse> {
    return this.http.get<GeoapifyResponse>(`${this.apiUrl}/searchSuggestion/:${text}`);
  }
}