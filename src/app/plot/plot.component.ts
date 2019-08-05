import { Component, OnDestroy } from '@angular/core';
import { Plot, DEFAULT_PLOT } from '../plot';
import { Person } from '../person';
import { Subject, fromEvent, Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap, map, takeUntil, tap, debounceTime, startWith } from 'rxjs/operators';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-plot',
  templateUrl: './plot.component.html',
  styleUrls: ['./plot.component.scss']
})
export class PlotComponent implements OnDestroy {
  private plotDoc: AngularFirestoreDocument<Plot>;
  plot: Plot;
  loading: boolean = true;
  private unsubscribe$ = new Subject();
  isScreenSmall$?: Observable<boolean>;

  constructor(db: AngularFirestore, route: ActivatedRoute) {
    route.paramMap.pipe(
      takeUntil(this.unsubscribe$),
      map((params: ParamMap) => db.doc<Plot>(`plots/${params.get('id')}`)),
      tap((v: AngularFirestoreDocument<Plot>) => this.plotDoc = v),
      switchMap((v: AngularFirestoreDocument<Plot>) => v.valueChanges()),
      tap((v: Plot) => console.log('got new plot', v)),
    ).subscribe({
      next: (v: Plot) => {
        this.plot = v;
        this.loading = false;
        if (this.plot.places.length === 0) {
          this.updatePlot({ places: DEFAULT_PLOT.places, });
        }
      }
    });
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

  private copyPeople(): Person[] {
    return JSON.parse(JSON.stringify(this.plot.people));
  }

  updatePlot(v: Partial<Plot>) {
    if (!v.createdAt) {
      v.createdAt = firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
    }
    v.updatedAt = firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
    this.plotDoc.update(v);
  }

  addPerson(person: Person) {
    let people = this.copyPeople();
    people.push(person);
    this.updatePlot({ people });
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
      let people = this.copyPeople();
      people[position] = person;
      this.updatePlot({ people });
    }
  }

  deletePerson(person: Person) {
    const position = this.idForPerson(person);
    if (position !== -1) {
      let people = this.copyPeople();
      people.splice(position, 1);
      this.updatePlot({ people });
    }
  }
}
