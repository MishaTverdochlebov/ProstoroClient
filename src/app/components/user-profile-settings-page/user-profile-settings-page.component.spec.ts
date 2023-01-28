import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileSettingsPageComponent } from './user-profile-settings-page.component';

describe('UserProfileSettingsPageComponent', () => {
  let component: UserProfileSettingsPageComponent;
  let fixture: ComponentFixture<UserProfileSettingsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserProfileSettingsPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileSettingsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
