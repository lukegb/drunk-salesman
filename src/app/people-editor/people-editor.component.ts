import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Person } from '../person';

@Component({
  selector: 'app-people-editor',
  templateUrl: './people-editor.component.html',
  styleUrls: ['./people-editor.component.scss']
})
export class PeopleEditorComponent implements OnInit {

  @Output() updatedPeople = new EventEmitter<Person[]>();

  people: Person[] = [];
  editing: boolean[] = [];

  loadPeople(): boolean {
    const maybePeople = window.localStorage.getItem('people');
    if (maybePeople === null) return false;
    this.people = JSON.parse(maybePeople);
    for (let i = 0; i < this.people.length; i++) {
      this.editing.push(false);
    }
    return true;
  }

  savePeople(): void {
    // TODO(lukegb): This save/load functionality should really be in a service...
    window.localStorage.setItem('people', JSON.stringify(this.people));
    this.emitUpdate();
  }

  ngOnInit() {
    if (!this.loadPeople()) {
      this.addEmptyPerson();
    }
    this.emitUpdate();
  }

  setPerson(i, person) {
    this.editing[i] = false;
    this.people[i] = person;
    this.savePeople();
  }

  deletePerson(i) {
    this.editing.splice(i, 1);
    this.people.splice(i, 1);
    this.savePeople();
  }

  addEmptyPerson() {
    this.people.push({
      name: `Person ${this.people.length + 1}`,
      startingLocation: null,
      endingLocation: null,
    });
    this.editing.push(true);
  }

  emitUpdate() {
    this.updatedPeople.emit(this.people.filter((person) => {
      return person.name && person.startingLocation && person.endingLocation;
    }));
  }

}
