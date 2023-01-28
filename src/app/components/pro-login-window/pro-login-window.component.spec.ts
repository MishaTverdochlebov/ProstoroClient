import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProLoginWindowComponent } from './pro-login-window.component';

describe('ProLoginWindowComponent', () => {
  let component: ProLoginWindowComponent;
  let fixture: ComponentFixture<ProLoginWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProLoginWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProLoginWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
