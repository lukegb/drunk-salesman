import { Component, OnDestroy } from '@angular/core';
import { Plot } from '../plot';
import { Subject, fromEvent, Observable } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, takeUntil, tap, debounceTime, startWith } from 'rxjs/operators';
import { PlotService, MutablePlot } from '../plot.service';
import { Title } from '@angular/platform-browser';
import { HeaderService } from '../header.service';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements OnDestroy {
  plot$: Observable<Plot>;
  plot: MutablePlot;
  private unsubscribe$ = new Subject<void>();
  isScreenSmall$?: Observable<boolean>;

  constructor(route: ActivatedRoute, plotService: PlotService, titleService: Title, headerService: HeaderService) {
    this.plot$ = route.paramMap.pipe(
      takeUntil(this.unsubscribe$),
      map((params: ParamMap) => {
        const id = params.get('id');
        if (id === 'offline') {
          return plotService.offlinePlot();
        }
        return plotService.firebasePlot(id);
      }),
      tap((v: MutablePlot) => this.plot = v),
      switchMap((v: MutablePlot) => v.get()),
      tap((v: Plot) => console.log('got new plot', v)),
      tap((v: Plot) => {
        titleService.setTitle(`${v.name} | Drunken Salesman`)
        headerService.setTitle(v.name);
      })
    );
  }

  ngOnInit(): void {
    const isSmall = () => document.body.offsetWidth <= 800;
    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(
      debounceTime(500),
      map(isSmall));
    this.isScreenSmall$ = screenSizeChanged$.pipe(startWith(isSmall()));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
