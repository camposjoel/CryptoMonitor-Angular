import { Component, inject, OnInit, signal, viewChild, effect } from '@angular/core';
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
export class TableComponent implements OnInit {
  realTimePrices = signal<WsPrices>({});
  tableColumns: string[] = ['image', 'rank', 'name', 'price', 'capacity', 'variation'];
  datasource = new MatTableDataSource<Coin>([]);
  pageSize = signal(15);
  pageIndex = signal(0);
  maxPageIndex = signal(0);

  paginator = viewChild(MatPaginator);
  sort = viewChild(MatSort);

  private coincapService = inject(CoincapService);

  constructor() {
    effect(() => {
      const paginator = this.paginator();
      if (paginator) {
        this.datasource.paginator = paginator;
      }
    });

    effect(() => {
      const sort = this.sort();
      if (sort) {
        this.datasource.sort = sort;
      }
    });
  }

  ngOnInit() {
    this.obtainCoins();
  }

  obtainCoins() {
    this.coincapService.getCoins(this.pageSize(), this.pageIndex() + 1).subscribe({
      next: coinData => this.datasource.data = [...this.datasource.data, ...coinData],
      complete: () => this.getCoinsPrices(),
      error: errorMsg => console.log(errorMsg)
    });
  }

  getCoinsPrices() {
    if (!environment.websocketsEnabled) return;
    const names = this.getCoinsNames();
    this.coincapService.getRealTimePrices(names)
      .pipe(
        tap(prices => this.realTimePrices.update(current => ({ ...current, ...prices }))),
        delay(300)
      )
      .subscribe(prices => {
        this.datasource.data.map(coin => {
          coin.priceUsd = prices[coin.id] ? prices[coin.id] : coin.priceUsd;
        });
      });
  }

  getCoinsNames() {
    const startIndex = this.pageIndex() * this.pageSize();
    const endIndex = startIndex + this.pageSize();
    return this.datasource.data.slice(startIndex, endIndex).map(coin => coin.id).join();
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    if (this.pageIndex() > this.maxPageIndex()) {
      this.obtainCoins();
      this.maxPageIndex.set(this.pageIndex());
    }
  }
}
