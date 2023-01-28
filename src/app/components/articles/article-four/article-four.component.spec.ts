import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleFourComponent } from './article-four.component';

describe('ArticleFourComponent', () => {
  let component: ArticleFourComponent;
  let fixture: ComponentFixture<ArticleFourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticleFourComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleFourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
