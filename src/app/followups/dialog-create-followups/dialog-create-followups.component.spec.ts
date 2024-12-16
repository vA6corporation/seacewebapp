import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateFollowupsComponent } from './dialog-create-followups.component';

describe('DialogCreateFollowupsComponent', () => {
  let component: DialogCreateFollowupsComponent;
  let fixture: ComponentFixture<DialogCreateFollowupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogCreateFollowupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCreateFollowupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
