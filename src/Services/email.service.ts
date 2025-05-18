import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailRequest } from '../Models/EmailRequest';
import { EmailMessage } from '../Models/EmailMessage';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = `${environment.apiUrl}/api/Email`

  constructor(private http: HttpClient) { }

  sendEmail(request: EmailRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/send`, request);
  }

  getUnreadEmails(): Observable<EmailMessage[]> {
    return this.http.get<EmailMessage[]>(`${this.apiUrl}/unread`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/mark-as-read/${id}`, {});
  }

  deleteEmail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
