import { Routes } from '@angular/router';
import { TableComponent } from './components/table/table.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: TableComponent }
];