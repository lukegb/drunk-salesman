import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelMatrixComponent } from './travel-matrix.component';

describe('TravelMatrixComponent', () => {
  let component: TravelMatrixComponent;
  let fixture: ComponentFixture<TravelMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TravelMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TravelMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
