import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr'; 
import { Property } from '../../models/property';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  
  private apiUrl = 'http://localhost:3000/properties';
  private baseApiUrl= 'http://localhost:3000'

  constructor(private http: HttpClient, private router: Router,  private toastr: ToastrService ) { }

  getAllProperties(): Observable<any[]> {
    return this.http.get<Property[]>(`${this.apiUrl}/all`); 
  }
 
  getPropertyById(id: number): Observable<any> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`);
  }

  getPropertiesByAgency(agencyId: number) {
    return this.http.get<Property[]>(`${this.baseApiUrl}/agencies/${agencyId}/properties`);
  }

  createProperty(propertyData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, propertyData);
  }
}
