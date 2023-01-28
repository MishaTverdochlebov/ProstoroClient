import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProMainPageComponent } from './pro-main-page.component';

describe('ProMainPageComponent', () => {
  let component: ProMainPageComponent;
  let fixture: ComponentFixture<ProMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProMainPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
