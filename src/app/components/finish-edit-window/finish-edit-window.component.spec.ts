import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishEditWindowComponent } from './finish-edit-window.component';

describe('FinishEditWindowComponent', () => {
  let component: FinishEditWindowComponent;
  let fixture: ComponentFixture<FinishEditWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishEditWindowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishEditWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
