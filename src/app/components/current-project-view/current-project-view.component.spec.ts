import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentProjectViewComponent } from './current-project-view.component';

describe('CurrentProjectViewComponent', () => {
  let component: CurrentProjectViewComponent;
  let fixture: ComponentFixture<CurrentProjectViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentProjectViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentProjectViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
