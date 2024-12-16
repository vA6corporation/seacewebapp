import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditFollowupsComponent } from './dialog-edit-followups.component';

describe('DialogEditFollowupsComponent', () => {
  let component: DialogEditFollowupsComponent;
  let fixture: ComponentFixture<DialogEditFollowupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEditFollowupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEditFollowupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
