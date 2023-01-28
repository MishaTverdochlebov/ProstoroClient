import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectContentElementComponent } from './project-content-element.component';

describe('ProjectContentElementComponent', () => {
  let component: ProjectContentElementComponent;
  let fixture: ComponentFixture<ProjectContentElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectContentElementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectContentElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
