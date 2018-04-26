import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GeosportsService {
  private readonly baseURL = "http://localhost:3000/api/users";

  constructor(private httpClient: HttpClient) { }

  public count(params: any[]): Observable<any[]> {
    const url = this.baseURL + '/count';
    let httpParams = new HttpParams();

    for (let i = 0; i < params.length; i++) {
      httpParams.set(params[i].name, params[i].value);
    }

    return this.httpClient.get<any[]>(url, { params: httpParams });
  }

}
