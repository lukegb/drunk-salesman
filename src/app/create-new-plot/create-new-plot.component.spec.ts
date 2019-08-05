import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPlotComponent } from './create-new-plot.component';

describe('CreateNewPlotComponent', () => {
  let component: CreateNewPlotComponent;
  let fixture: ComponentFixture<CreateNewPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
