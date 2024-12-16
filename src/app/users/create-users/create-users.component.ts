import { HttpErrorResponse } from '@angular/common/http'
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation/navigation.service';
import { UsersService } from '../users.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-create-users',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './create-users.component.html',
    styleUrls: ['./create-users.component.sass']
})
export class CreateUsersComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        // mobileNumber: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        isAdmin: false
    })
    isLoading: boolean = false
    hide: boolean = true

    private handleCommercials$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleCommercials$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo usuario')
    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.usersService.create(this.formGroup.value).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/users'])
                    this.usersService.loadUsers()
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
