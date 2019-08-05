import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePlotComponent } from './offline-plot.component';

describe('OfflinePlotComponent', () => {
  let component: OfflinePlotComponent;
  let fixture: ComponentFixture<OfflinePlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinePlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
