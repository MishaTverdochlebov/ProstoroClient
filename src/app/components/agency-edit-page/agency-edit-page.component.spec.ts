import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyEditPageComponent } from './agency-edit-page.component';

describe('AgencyEditPageComponent', () => {
  let component: AgencyEditPageComponent;
  let fixture: ComponentFixture<AgencyEditPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyEditPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyEditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
