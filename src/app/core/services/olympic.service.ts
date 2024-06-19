import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Olympic } from 'src/app/core/models/Olympic';
import { Participation } from 'src/app/core/models/Participation';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);

  constructor(private http: HttpClient, private router: Router) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => this.olympics$.next(value)),
      catchError(() => {
        this.router.navigateByUrl('error/initialdata');
        return of([]);
      })
    );
  }

  getOlympics() {
    return this.olympics$.asObservable();
  }

  getCountryTotalMedals(participations: Participation[]): number {
    let totalMedals: number = 0;
    participations.forEach((participation) => {
      totalMedals += participation.medalsCount;
    });
    return totalMedals;
  }

  getOlympicByName(olympicName: string) {
    return this.olympics$.pipe(
      map((value) => value.find((v) => v.country === olympicName))
    );
  }
}
