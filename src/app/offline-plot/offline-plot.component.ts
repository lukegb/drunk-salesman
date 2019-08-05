import { Component, OnInit } from '@angular/core';
import { Plot, DEFAULT_PLOT } from '../plot';
import { Person } from '../person';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-offline-plot',
  templateUrl: './offline-plot.component.html',
  styleUrls: ['./offline-plot.component.scss']
})
export class OfflinePlotComponent implements OnInit {
  plot: Plot;

  isScreenSmall$?: Observable<boolean>;

  ngOnInit() {
    this.plot = DEFAULT_PLOT;

    const isSmall = () => document.body.offsetWidth <= 800;
    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(
      debounceTime(500),
      map(isSmall));
    this.isScreenSmall$ = screenSizeChanged$.pipe(startWith(isSmall()));
  }

  addPerson(person: Person) {
    this.plot.people.push(person);
  }

  private idForPerson(person: Person): number {
    for (let i = 0; i < this.plot.people.length; i++) {
      if (person.id === this.plot.people[i].id) {
        return i;
      }
    }
    return -1;
  }

  updatePerson(person: Person) {
    const position = this.idForPerson(person);
    if (position !== -1) {
      this.plot.people[position] = person;
    }
  }

  deletePerson(person: Person) {
    const position = this.idForPerson(person);
    if (position !== -1) {
      this.plot.people.splice(position, 1);
    }
  }
}
