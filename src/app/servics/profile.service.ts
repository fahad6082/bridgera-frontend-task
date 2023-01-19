import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private API_URL = 'http://localhost:7000/api/user';

  constructor(
    private http: HttpClient,
  ) { }

  list(param = {page:0, limit: 1000}): Observable<any> {
    return this.http.get<any>(this.API_URL);
  }

  add(data: any): Observable<any> {
    return this.http.post<any>(this.API_URL, data);
  }

  edit(params, data: any): Observable<any> {
    return this.http.patch<any>(this.API_URL, data , { params });
  }

  delete(params): Observable<any> {
    return this.http.delete<any>(this.API_URL , { params });
  }
}
