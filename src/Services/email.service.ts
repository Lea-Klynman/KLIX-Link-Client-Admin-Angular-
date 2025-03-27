import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailRequest } from '../Models/EmailRequest';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = `${environment.apiUrl}/api/Email`; 

  constructor(private http: HttpClient) { }

  sendEmail(request: EmailRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/send`, request);
  }}
