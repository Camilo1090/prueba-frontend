import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from "../../environments/environment";
import { API } from "../api/api";

@Injectable()
export class GeosportsService {
  private readonly baseURL;

  constructor(private httpClient: HttpClient) {
    if (environment.production)
      this.baseURL = API.url_production;
    else
      this.baseURL = API.url_development;
  }

  public count(params: any): Observable<any[]> {
    const url = this.baseURL + '/count';
    let httpParams = new HttpParams({ fromObject: params });

    return this.httpClient.get<any[]>(url, { params: httpParams });
  }

}
