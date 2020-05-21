import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticatedViewComponent } from './authenticated-view.component';

describe('AuthenticatedViewComponent', () => {
  let component: AuthenticatedViewComponent;
  let fixture: ComponentFixture<AuthenticatedViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticatedViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticatedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
