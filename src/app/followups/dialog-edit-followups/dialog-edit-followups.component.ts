import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { FollowupsService } from '../followups.service';
import { UsersService } from '../../users/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserModel } from '../../users/user.model';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-edit-followups',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dialog-edit-followups.component.html',
  styleUrl: './dialog-edit-followups.component.sass'
})
export class DialogEditFollowupsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly followupId: string,
        private readonly navigationService: NavigationService,
        private readonly followupsService: FollowupsService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialogRef: MatDialogRef<DialogEditFollowupsComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        observations: '',
        color: '',
        assignedUserId: null,
    })
    isLoading: boolean = false
    users: UserModel[] = []
    colors: any[] = [
        { name: 'VERDE', code: '#90EE90' },
        { name: 'AMARILLO', code: '#FFEE55' },
        { name: 'ROJO', code: '#FFA7A6' },
        { name: 'AZUL', code: '#17A2B8' },
    ]
    observations: string[] = [
        'TIENE BROKER',
        'NO REQUERE FIANZA',
        'TRABAJA CON EL BANCO',
        'NO CALIFICA',
        'YA TRABAJA CON LA ASEGURADORA'
    ]

    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleUsers$.unsubscribe()
    }

    ngOnInit(): void {
        this.followupsService.getFollowupById(this.followupId).subscribe(followup => {
            this.formGroup.patchValue(followup)
        })

        this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })
    }

    onChangeObservations(observations: string) {
        this.formGroup.patchValue({ observations })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const follow = this.formGroup.value
            follow.color = follow.color || ''
            this.followupsService.update(follow, this.followupId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.matDialogRef.close(true)
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
