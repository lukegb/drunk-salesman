import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Person } from '../person';
import { FormGroup, FormControl } from '@angular/forms';
import { Place } from '../place';

@Component({
  selector: 'app-person-editor',
  templateUrl: './person-editor.component.html',
  styleUrls: ['./person-editor.component.scss']
})
export class PersonEditorComponent implements OnInit {

  @Input() person: Person;
  @Output() updated = new EventEmitter<Person>();

  startingLocation: Place;
  endingLocation: Place;

  formGroup = new FormGroup({
    name: new FormControl(''),
    startingLocation: new FormControl(''),
    endingLocation: new FormControl(''),
  });

  private textPlaceRepresentation(place: Place): string {
    if (place === null)
      return '';
    return place.address;
  }

  ngOnInit() {
    this.formGroup.patchValue({
      name: this.person.name,
      startingLocation: this.textPlaceRepresentation(this.person.startingLocation),
      endingLocation: this.textPlaceRepresentation(this.person.endingLocation),
    });
    this.startingLocation = this.person.startingLocation;
    this.endingLocation = this.person.endingLocation;
  }

  startingLocationChanged(place) {
    this.startingLocation = place;
  }

  endingLocationChanged(place) {
    this.endingLocation = place;
  }

  onSubmit() {
    this.updated.emit({
      name: this.formGroup.value.name,
      startingLocation: this.startingLocation,
      endingLocation: this.endingLocation,
    });
  }

  cancelEdit() {
    this.updated.emit(this.person);
  }

}
