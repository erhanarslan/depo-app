import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { WarehouseSectionComponent } from "./components/warehouse-section/warehouse-section.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    WarehouseSectionComponent
],
  template: `
    <app-header></app-header>
    <app-warehouse-section></app-warehouse-section>
  `
})
export class AppComponent {
  title = 'warehouse-app';
}
