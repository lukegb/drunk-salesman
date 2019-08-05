import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { PeopleEditorComponent } from './people-editor/people-editor.component';
import { PersonEditorComponent } from './person-editor/person-editor.component';
import { MapsAutocompleteDirective } from './maps-autocomplete.directive';
import { PersonViewComponent } from './person-view/person-view.component';
import { MapComponent } from './map/map.component';
import { TravelMatrixComponent } from './travel-matrix/travel-matrix.component';
import { PlotComponent } from './plot/plot.component';

import { environment } from '../environments/environment';
import { OfflinePlotComponent } from './offline-plot/offline-plot.component';
import { CreateNewPlotComponent } from './create-new-plot/create-new-plot.component';
import { NotFoundComponent } from './not-found/not-found.component';

const appRoutes: Routes = [
  { path: 'plot/offline', component: OfflinePlotComponent },
  { path: 'plot/:id', component: PlotComponent },
  { path: '', component: CreateNewPlotComponent, pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    PeopleEditorComponent,
    PersonEditorComponent,
    MapsAutocompleteDirective,
    PersonViewComponent,
    MapComponent,
    TravelMatrixComponent,
    PlotComponent,
    OfflinePlotComponent,
    CreateNewPlotComponent,
    NotFoundComponent,
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB4qwy3dLU5afh4px9R33CIWlJsbFB-GP8',
      libraries: ['places'],
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
