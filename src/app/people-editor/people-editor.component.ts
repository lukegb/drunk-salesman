import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Person } from '../person';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-people-editor',
  templateUrl: './people-editor.component.html',
  styleUrls: ['./people-editor.component.scss']
})
export class PeopleEditorComponent implements OnInit {

  @Output() addedPerson = new EventEmitter<Person>();
  @Output() updatedPerson = new EventEmitter<Person>();
  @Output() deletedPerson = new EventEmitter<Person>();
  @Input() people: Person[] = [];
  creatingPeople: Person[] = [];

  editing: Map<string, boolean> = new Map<string, boolean>();

  ngOnInit() {
    this.ensureAtLeastOnePerson();
  }

  ensureAtLeastOnePerson() {
    if (this.people.length === 0 && this.creatingPeople.length === 0) {
      this.addEmptyPerson();
    }
  }

  setPerson(person: Person) {
    this.editing.set(person.id, false);
    this.updatedPerson.emit(person);
  }

  createPerson(person: Person, i: number) {
    this.editing.set(person.id, false);
    this.creatingPeople.splice(i, 1);
    this.addedPerson.emit(person);
  }

  deleteAllowed(): boolean {
    return this.people.length > 0 || this.creatingPeople.length > 1;
  }

  deletePerson(person: Person) {
    this.deletedPerson.emit(person);
    this.editing.delete(person.id);
    this.ensureAtLeastOnePerson();
  }

  deleteCreatingPerson(index: number) {
    this.creatingPeople.splice(index, 1);
    this.ensureAtLeastOnePerson();
  }

  addEmptyPerson() {
    const newPerson: Person = {
      id: uuid(),
      name: `Person ${this.people.length + this.creatingPeople.length + 1}`,
      startingLocation: null,
      endingLocation: null,
    };
    this.creatingPeople.push(newPerson);
    this.editing.set(newPerson.id, true);
  }

}
