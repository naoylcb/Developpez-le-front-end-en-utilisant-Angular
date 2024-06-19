import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { StatData } from 'src/app/core/models/StatData';
import { Participation } from 'src/app/core/models/Participation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy {
  title!: string;
  stats: StatData[] = [];
  view!: [number, number];
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxis: boolean = true;
  yAxis: boolean = true;
  xAxisLabel: string = 'Dates';
  data!: { name: string; series: { name: string; value: number }[] }[];
  private destroy$!: Subject<boolean>;

  constructor(
    private route: ActivatedRoute,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    this.destroy$ = new Subject<boolean>();
    const countryName: string = this.route.snapshot.params['countryName'];
    this.olympicService
      .getOlympicByName(countryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe((olympic) => {
        if (olympic) {
          this.data = [
            {
              name: olympic.country,
              series: olympic.participations.map((p) => {
                return { name: p.year.toString(), value: p.medalsCount };
              }),
            },
          ];
          this.title = olympic.country;
          this.stats.push({
            title: 'Number of entries',
            value: olympic.participations.length,
          });
          this.stats.push({
            title: 'Total number of medals',
            value: this.olympicService.getCountryTotalMedals(
              olympic.participations
            ),
          });
          this.stats.push({
            title: 'Total number of athletes',
            value: this.getCountryTotalAthletes(olympic.participations),
          });
        }
      });
  }

  getCountryTotalAthletes(participations: Participation[]): number {
    let totalAthletes: number = 0;
    participations.forEach((participation) => {
      totalAthletes += participation.athleteCount;
    });
    return totalAthletes;
  }

  resizeChart(width: number): void {
    this.view = [width, 500];
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }
}
