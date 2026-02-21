import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-searches',
  imports: [],
  templateUrl: './searches.html',
  styleUrl: './searches.scss',
})
export class Searches {
  
}



// Definizione opzionale dell'interfaccia per i risultati (per avere l'autocompletamento)
interface GeoapifyResponse {
  results: Array<{
    formatted: string;
    lat: number;
    lon: number;
    // aggiungi altri campi se necessario
  }>;
}

const apiKey: string = 'YOUR_API_KEY';
const text: string = encodeURIComponent('san g');
const url: string = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&limit=5&format=json&apiKey=${apiKey}`;

async function getAutocomplete(): Promise<void> {
  try {
    const response = await fetch(url, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`Errore HTTP: ${response.status}`);
    }

    const data = await response.json() as GeoapifyResponse;
    console.log(data);
  } catch (error) {
    console.error('Si è verificato un errore:', error);
  }
}

getAutocomplete();