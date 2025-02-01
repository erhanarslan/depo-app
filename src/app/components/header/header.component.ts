import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, forkJoin, interval } from 'rxjs';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../services/search.service';

interface ExchangeRate {
  currency: string;
  rate: number;
}

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    CommonModule
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  exchangeRates: ExchangeRate[] = [];
  private rateSubscription?: Subscription;

  constructor(
    private exchangeRateService: ExchangeRateService,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.fetchExchangeRates();
    this.rateSubscription = interval(30000).subscribe(() => {
      this.fetchExchangeRates();
    });
  }

  ngOnDestroy() {
    if (this.rateSubscription) {
      this.rateSubscription.unsubscribe();
    }
  }

  private fetchExchangeRates() {
    forkJoin({
      usd: this.exchangeRateService.getExchangeRate('USD'),
      eur: this.exchangeRateService.getExchangeRate('EUR'),
      gbp: this.exchangeRateService.getExchangeRate('GBP')
    }).subscribe(data => {

      this.exchangeRates = [
        { currency: 'USD', rate: data.usd.rates.TRY },
        { currency: 'EUR', rate: data.eur.rates.TRY },
        { currency: 'GBP', rate: data.gbp.rates.TRY }
      ];
    });
  }

  onSearch(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.searchService.updateSearchTerm(searchTerm);
  }
}
