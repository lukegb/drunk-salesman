import { Injectable } from '@angular/core';
import { Plot, DEFAULT_PLOT } from './plot';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Person } from './person';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlotService {

  constructor(private db: AngularFirestore) { }

  async createFirebasePlot(): Promise<FirebasePlot> {
    const plotDoc = await this.db.collection<Plot>('plots')
      .add({
        name: 'My Awesome Plot',
        places: DEFAULT_PLOT.places,
        people: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      });
    return this.firebasePlot(plotDoc.id);
  }

  firebasePlot(id: string): FirebasePlot {
    return new FirebasePlot(this.db.doc<Plot>(`plots/${id}`));
  }

  offlinePlot(): OfflinePlot {
    return new OfflinePlot;
  }
}

export abstract class MutablePlot {
  protected plot: Plot;

  abstract get(): Observable<Plot>;
  unsubscribe(): void { }
  protected abstract updatePlot(plot: Partial<Plot>): void;

  protected idForPerson(person: Person): number {
    for (let i = 0; i < this.plot.people.length; i++) {
      if (person.id === this.plot.people[i].id) {
        return i;
      }
    }
    return -1;
  }

  addPerson(person: Person) {
    this.plot.people.push(person);
    this.updatePlot({ people: this.plot.people });
  }

  updatePerson(person: Person) {
    const position = this.idForPerson(person);
    if (position !== -1) {
      this.plot.people[position] = person;
    }
    this.updatePlot({ people: this.plot.people });
  }

  deletePerson(person: Person) {
    const position = this.idForPerson(person);
    if (position !== -1) {
      this.plot.people.splice(position, 1);
    }
    this.updatePlot({ people: this.plot.people });
  }
}

class OfflinePlot extends MutablePlot {
  private plot$: Subject<Plot>;

  constructor() {
    super();
    this.plot = DEFAULT_PLOT;
    this.plot$ = new BehaviorSubject<Plot>(this.plot);
  }

  get(): Observable<Plot> {
    return this.plot$;
  }

  protected updatePlot(p: Partial<Plot>): void {
    this.plot$.next(JSON.parse(JSON.stringify(this.plot)));
  }
}

class FirebasePlot extends MutablePlot {
  private unsubscribe$: Subject<void>;
  id: string;

  constructor(private plotDoc: AngularFirestoreDocument<Plot>) {
    super();
    this.id = plotDoc.ref.id;
    this.unsubscribe$ = new Subject<void>();
    this.plotDoc.valueChanges()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (v) => this.plot = v,
      });
  }

  get(): Observable<Plot> {
    return this.plotDoc.valueChanges();
  }
  unsubscribe(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  protected updatePlot(p: Partial<Plot>): void {
    if (!p.createdAt) {
      p.createdAt = firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
    }
    p.updatedAt = firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp;
    this.plotDoc.update(p);
  }
}