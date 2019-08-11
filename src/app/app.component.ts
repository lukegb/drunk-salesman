import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, mergeMap, map, tap } from 'rxjs/operators';
import { HeaderService } from './header.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title$: Observable<string>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private headerService: HeaderService,
  ) {
    this.title$ = headerService.getTitle();
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
      ).subscribe((event) => {
        if (event['setsOwnTitle']) return;
        this.titleService.setTitle(event['title'] ? `${event['title']} | Drunken Salesman` : 'Drunken Salesman')
        this.headerService.setTitle('Drunken Salesman');
      });
  }
}
