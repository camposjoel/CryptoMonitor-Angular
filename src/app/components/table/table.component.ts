import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
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
  
  @ViewChild(MatPaginator)
  paginator: MatPaginator | null = null;

  constructor(
    private coincapService: CoincapService
  ) {}

  @ViewChild(MatSort)
  sort: MatSort | null = null;
  

  ngOnInit() {
    this.coincapService.getCoins().subscribe({
      next: (coinData) => {
        this.datasource.data = coinData.data;
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
    return this.datasource.data.map(coin => coin.id).join();
  }

  testChanges(event?: any) {
    console.log('hey', event.target.textContent);
  }
}
