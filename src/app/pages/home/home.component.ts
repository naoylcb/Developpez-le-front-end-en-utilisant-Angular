import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Olympic } from 'src/app/core/models/Olympic';
import { StatData } from 'src/app/core/models/StatData';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  medalImage: string = './assets/images/medal.svg';
  olympics$: Observable<Olympic[]> = of([]);
  data: { name: string; value: number }[] = [];
  view!: [number, number];
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  title: string = 'Medals per Coutry';
  stats: StatData[] = [];
  private destroy$!: Subject<boolean>;

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>(); // This subject serve to close observable subscription
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.length > 0) {
        this.data = value.map((element) => {
          return {
            name: element.country,
            value: this.olympicService.getCountryTotalMedals(
              element.participations
            ),
          };
        });
        this.stats.push(this.getNumberJos(value));
        this.stats.push({ title: 'Number of countries', value: value.length });
      }
    });
  }

  getNumberJos(countries: Olympic[]): StatData {
    // Get total number of Jos for all countries
    let jos: string[] = [];
    countries.forEach((country) => {
      country.participations.forEach((participation) => {
        if (!jos.includes(participation.city)) {
          jos.push(participation.city);
        }
      });
    });
    return { title: 'Number of JOs', value: jos.length };
  }

  resizeChart(width: number): void {
    // Resize the chart according to window size changes
    this.view = [width, 500];
  }

  goOnCountryDetail(countryName: string): void {
    this.router.navigateByUrl(`detail/${countryName}`);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
