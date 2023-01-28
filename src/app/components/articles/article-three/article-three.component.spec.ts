import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleThreeComponent } from './article-three.component';

describe('ArticleThreeComponent', () => {
  let component: ArticleThreeComponent;
  let fixture: ComponentFixture<ArticleThreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleThreeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
