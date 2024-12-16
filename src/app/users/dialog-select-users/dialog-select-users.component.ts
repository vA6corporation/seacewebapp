import { Component, EventEmitter } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { UsersService } from '../users.service';
import { UserModel } from '../user.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-select-users',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './dialog-select-users.component.html',
    styleUrl: './dialog-select-users.component.sass'
})
export class DialogSelectUsersComponent {

    constructor(
        private readonly usersService: UsersService,
        private readonly matDialogRef: MatDialogRef<DialogSelectUsersComponent>
    ) { }
    users: UserModel[] = []

    private handleSelectUser$: EventEmitter<UserModel | null> = new EventEmitter()
    private handleUsers$: Subscription = new Subscription()

    onSelectUser(user: UserModel | null) {
        this.handleSelectUser$.next(user)
        this.matDialogRef.close()
    }

    handleSelectUser() {
        return this.handleSelectUser$
    }

    ngOnDestroy() {
        this.handleUsers$.unsubscribe()
    }

    ngOnInit() {
        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })
    }

}
