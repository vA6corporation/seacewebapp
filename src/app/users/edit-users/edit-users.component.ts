import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavigationService } from '../../navigation/navigation.service';
import { UsersService } from '../users.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-users',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './edit-users.component.html',
    styleUrls: ['./edit-users.component.sass']
})
export class EditUsersComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly formBuilder: FormBuilder,
        private readonly usersService: UsersService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    })
    isLoading: boolean = false
    hide: boolean = true
    private userId: string = ''

    private handleCommercials$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCommercials$.unsubscribe()
    }
    ngOnInit(): void {
        this.navigationService.setTitle('Editar usuario')
        this.userId = this.activatedRoute.snapshot.params['userId']

        this.usersService.getUserById(this.userId).subscribe(user => {
            this.formGroup.patchValue(user)
        })
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.usersService.update(this.formGroup.value, this.userId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/users'])
                    this.navigationService.showMessage('Se han guardado los cambios')
                    this.usersService.loadUsers()
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
