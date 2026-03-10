import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SearchesService {

    private apiUrl = 'http://localhost:3000/searches';

    constructor(private http: HttpClient) { }

    createSearch(criteria: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, { criteria }, { withCredentials: true });
    }
}
