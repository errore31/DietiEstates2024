import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Property } from '../../models/property';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {

  private apiUrl = 'http://localhost:3000/properties';
  private baseApiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  getAllProperties(): Observable<any[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/all`);
  }

  getPropertyById(id: number): Observable<any> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  getPropertiesByAgency(agencyId: number) {
    return this.http.get<Property[]>(`${this.baseApiUrl}/agencies/${agencyId}/properties`);
  }

  getPropertiesBySearch(text: string) {
    return this.http.get<Property[]>(`${this.apiUrl}/search/${text}`);
  }

  getPropertiesByAdvancedSearch(searchParams: any): Observable<Property[]> {
    let params = new HttpParams();
    for (const key in searchParams) {
      if (searchParams[key] !== null && searchParams[key] !== undefined && searchParams[key] !== '') {
        params = params.set(key, searchParams[key]);
      }
    }
    return this.http.get<Property[]>(`${this.apiUrl}/advanced-search`, { params });
  }


  createProperty(propertyData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, propertyData);
  }

  updateProperty(id: number, propertyData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, propertyData);
  }
}
