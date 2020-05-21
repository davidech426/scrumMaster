import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamProjectCreationComponent } from './team-project-creation.component';

describe('TeamProjectCreationComponent', () => {
  let component: TeamProjectCreationComponent;
  let fixture: ComponentFixture<TeamProjectCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamProjectCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamProjectCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
