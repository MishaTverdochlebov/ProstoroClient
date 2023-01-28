import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyProfilePageComponent } from './agency-profile-page.component';

describe('AgencyProfilePageComponent', () => {
  let component: AgencyProfilePageComponent;
  let fixture: ComponentFixture<AgencyProfilePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgencyProfilePageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgencyProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
