import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { delay, tap } from 'rxjs';
import { Coin, WsPrices } from '@app/models/coin';
import { CoincapService } from '@app/services/coincap.service';
import { environment } from '@env/environment'

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    standalone: false
})
export class TableComponent implements OnInit, AfterViewInit {
  realTimePrices: WsPrices = {};
  tableColumns: string[] = ['image', 'rank', 'name', 'price', 'capacity', 'variation'];
  datasource = new MatTableDataSource<Coin>([]);
  pageSize = 15;
  pageIndex = 0;
  maxPageIndex = 0;
  
  @ViewChild(MatPaginator)
  paginator: MatPaginator | null = null;

  constructor(
    private coincapService: CoincapService
  ) {}

  @ViewChild(MatSort)
  sort: MatSort | null = null;
  

  ngOnInit() {
    this.obtainCoins();
  }

  obtainCoins() {
    this.coincapService.getCoins(this.pageSize, this.pageIndex + 1).subscribe({
      next: coinData => this.datasource.data = [ ...this.datasource.data, ...coinData ],
      complete: () => this.getCoinsPrices(),
      error: errorMsg => console.log(errorMsg)
    });
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  getCoinsPrices() {
    if (!environment.websocketsEnabled) return;
    const names = this.getCoinsNames();
    this.coincapService.getRealTimePrices(names)
      .pipe(
        tap(prices => this.realTimePrices = { ...this.realTimePrices, ...prices }),
        delay(300)
      )
      .subscribe(prices => {
        this.datasource.data.map(coin => {
           coin.priceUsd = prices[coin.id] ? prices[coin.id] : coin.priceUsd;
        });
      });
  }

  getCoinsNames() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.datasource.data.slice(startIndex, endIndex).map(coin => coin.id).join();
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    if (this.pageIndex > this.maxPageIndex) {
      this.obtainCoins();
      this.maxPageIndex = this.pageIndex;
    }
  }
}
