import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { webSocket } from 'rxjs/webSocket';
import { map, Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Coin, CoinsResponse, WsPrices } from '@app/models/coin';

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
    
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${environment.coincapKey}`);

    return this.http.get<CoinsResponse>(`${environment.restApi}`, { params, headers })
      .pipe(map(response => response.data));
  }

  getRealTimePrices(coinsNames: string): Observable<WsPrices> {
    return webSocket<WsPrices>(`${environment.wsApi}/prices?assets=${coinsNames}&apiKey=${environment.coincapKey}`)
      .asObservable();
  }
}
