import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Coin } from 'src/app/models/coin';
import { CoincapService } from 'src/app/services/coincap.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {
  realTimePrices: any = {};
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
      next: (coinData) => {
        this.datasource.data = [ ...this.datasource.data, ...coinData.data ];
      },
      error: errorMsg => console.log(errorMsg),
      complete: () => this.coincapService.getRealTimePrices(this.getCoinsNames())
        .subscribe({
          next: (prices) => {
            this.realTimePrices = { ...this.realTimePrices, ...prices };
            setTimeout(() => {
              this.datasource.data.map(coin => {
                coin.priceUsd = prices[coin.id] ? prices[coin.id] : coin.priceUsd;
              });
            }, 400);
          },
          error: errorMsg => console.log(errorMsg)
        })
    });
  }

  ngAfterViewInit() {
    this.datasource.paginator = this.paginator;
    this.datasource.sort = this.sort;
  }

  getCoinsNames() {
    return this.datasource.data.slice(this.pageIndex * this.pageSize, this.pageIndex * this.pageSize + this.pageSize).map(coin => coin.id).join();
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
