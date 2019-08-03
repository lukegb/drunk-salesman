import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { PeopleEditorComponent } from './people-editor/people-editor.component';
import { PersonEditorComponent } from './person-editor/person-editor.component';
import { MapsAutocompleteDirective } from './maps-autocomplete.directive';
import { PersonViewComponent } from './person-view/person-view.component';
import { MapComponent } from './map/map.component';
import { TravelMatrixComponent } from './travel-matrix/travel-matrix.component';

@NgModule({
  declarations: [
    AppComponent,
    PeopleEditorComponent,
    PersonEditorComponent,
    MapsAutocompleteDirective,
    PersonViewComponent,
    MapComponent,
    TravelMatrixComponent
  ],
  imports: [
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB4qwy3dLU5afh4px9R33CIWlJsbFB-GP8',
      libraries: ['places'],
    }),
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatTabsModule,
    MatToolbarModule,
    MatSidenavModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
