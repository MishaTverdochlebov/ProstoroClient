import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleTwoComponent } from './article-two.component';

describe('ArticleTwoComponent', () => {
  let component: ArticleTwoComponent;
  let fixture: ComponentFixture<ArticleTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
