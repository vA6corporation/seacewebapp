import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectUsersComponent } from './dialog-select-users.component';

describe('DialogSelectUsersComponent', () => {
  let component: DialogSelectUsersComponent;
  let fixture: ComponentFixture<DialogSelectUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogSelectUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogSelectUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
