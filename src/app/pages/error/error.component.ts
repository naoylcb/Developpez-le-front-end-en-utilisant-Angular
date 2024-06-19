import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  message!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Choose error message displayed according to errorType in url
    const errorType: string = this.route.snapshot.params['errorType'];
    switch (errorType) {
      case 'initialdata':
        this.message = 'Error during data recuperation !';
        break;
      case 'countrynotfound':
        this.message = 'This country is not found in our data !';
        break;
      default:
        this.message = 'An error occurred !';
    }
  }
}
