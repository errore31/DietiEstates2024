import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../models/user'; 

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseApiUrl= 'http://localhost:3000'
  constructor(private http: HttpClient, private router: Router,  private toastr: ToastrService ) {}

  createUser(userData: User) {
    return this.http.post<User>(`${this.baseApiUrl}/auth/signup`, userData);
  }

  createAgent(userData: User) {
    return this.http.post<User>(`${this.baseApiUrl}/users/createAgent`, userData);
  }

  
  deleteUser(userId: number){
    return this.http.delete<User>(`${this.baseApiUrl}/users/delete/${userId}`);
  }

  updateUser(userId: number, userData: User){
    return this.http.put<User>(`${this.baseApiUrl}/users/update/${userId}`, userData);
  }
    
}
