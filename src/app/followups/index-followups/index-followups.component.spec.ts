import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexFollowupsComponent } from './index-followups.component';

describe('IndexFollowupsComponent', () => {
  let component: IndexFollowupsComponent;
  let fixture: ComponentFixture<IndexFollowupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexFollowupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexFollowupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
