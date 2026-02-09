import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr'; 

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  
  private apiUrl = 'http://localhost:3000/properties';

  constructor(private http: HttpClient, private router: Router,  private toastr: ToastrService ) { }

  getAllProperties(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`); 
  }
 
  getPropertyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createProperty(propertyData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, propertyData);
  }
}
