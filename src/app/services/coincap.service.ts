import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { webSocket } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { Coin, CoinsResponse, WsPrices } from '../models/coin';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoincapService {

  constructor(private http: HttpClient) { }

  getCoins(itemsPerPage: number, page: number): Observable<Coin[]> {
    let limit = itemsPerPage;
    let offset = itemsPerPage * page;
    if (page === 1) {
      limit = itemsPerPage * 2;
      offset = itemsPerPage * page - itemsPerPage;
    }
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('offset', offset.toString());

    return this.http.get<CoinsResponse>(`${environment.restApi}`, { params }).pipe(map(response => response.data));
  }

  getRealTimePrices(coinsNames: string) {
    return webSocket<WsPrices>(`${environment.wsApi}/prices?assets=${coinsNames}`).asObservable();
  }
}
