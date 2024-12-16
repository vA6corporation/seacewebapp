import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedFollowupsComponent } from './deleted-followups.component';

describe('DeletedFollowupsComponent', () => {
  let component: DeletedFollowupsComponent;
  let fixture: ComponentFixture<DeletedFollowupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedFollowupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedFollowupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
