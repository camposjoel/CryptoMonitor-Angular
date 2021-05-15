import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Coin } from '../models/coin';

type CoinsResponse = {
  data: Array<Coin>,
  timestamp: number
}

@Injectable({
  providedIn: 'root'
})
export class CoincapService {

  constructor(private http: HttpClient) { }

  getCoins() {
    return this.http.get<CoinsResponse>(`${environment.restApi}`);
  }
}
