import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NavigationService } from '../../navigation/navigation.service';
import { FollowupsService } from '../followups.service';
import { UsersService } from '../../users/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserModel } from '../../users/user.model';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { SeaceModel } from '../../seaces/seace.model';

@Component({
  selector: 'app-dialog-create-followups',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dialog-create-followups.component.html',
  styleUrl: './dialog-create-followups.component.sass'
})
export class DialogCreateFollowupsComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly seace: SeaceModel,
        private readonly navigationService: NavigationService,
        private readonly followupsService: FollowupsService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialogRef: MatDialogRef<DialogCreateFollowupsComponent>
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        seaceId: ['', Validators.required],
        publishedAt: ['', Validators.required],
        adjudicatedAt: '',
        objectContract: ['', Validators.required],
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
        // { name: 'Naranja', code: '#F48F30' }
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
        this.formGroup.patchValue({
            seaceId: this.seace._id,
            adjudicatedAt: this.seace.adjudicatedAt,
            publishedAt: this.seace.publishedAt,
            objectContract: this.seace.objectContract,
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
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
            this.followupsService.create(follow).subscribe({
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
