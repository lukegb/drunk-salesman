import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

import { Plot, DEFAULT_PLOT } from '../plot';

import * as firebase from 'firebase/app';
import 'firebase/firestore';

@Component({
  selector: 'app-create-new-plot',
  templateUrl: './create-new-plot.component.html',
  styleUrls: ['./create-new-plot.component.scss']
})
export class CreateNewPlotComponent {

  constructor(private db: AngularFirestore, private router: Router) { }

  pleaseWait = false;

  createOfflinePlot() {
    this.router.navigate(['plot', 'offline']);
  }

  createFirestorePlot() {
    this.pleaseWait = true;
    this.db.collection<Plot>('plots')
      .add({
        name: 'My Awesome Plot',
        places: DEFAULT_PLOT.places,
        people: [],
        createdAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp() as firebase.firestore.Timestamp,
      })
      .then((docRef) => {
        this.router.navigate(['plot', docRef.id]);
      });
  }

}
