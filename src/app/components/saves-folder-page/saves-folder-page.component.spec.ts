import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavesFolderPageComponent } from './saves-folder-page.component';

describe('SavesFolderPageComponent', () => {
  let component: SavesFolderPageComponent;
  let fixture: ComponentFixture<SavesFolderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavesFolderPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavesFolderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
