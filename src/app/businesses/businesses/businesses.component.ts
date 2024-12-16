import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Params, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { BusinessModel } from '../business.model';
import { BusinessesService } from '../businesses.service';
import { UserModel } from '../../users/user.model';
import { Subscription } from 'rxjs';
import { UsersService } from '../../users/users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-businesses',
    standalone: true,
    imports: [MaterialModule, RouterModule, ReactiveFormsModule, CommonModule],
    templateUrl: './businesses.component.html',
    styleUrl: './businesses.component.sass'
})
export class BusinessesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly businessesService: BusinessesService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        assignedUserId: ''
    })
    displayedColumns: string[] = ['document', 'name', 'email', 'assignedUser', 'observations', 'actions']
    dataSource: BusinessModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 20]
    pageIndex: number = 0
    users: UserModel[] = []
    private params: Params = {}

    private handleUsers$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleUsers$.unsubscribe()
        this.handleSearch$.unsubscribe()
    }

    ngOnInit() {
        this.navigationService.setTitle('Empresas')

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.navigationService.setMenu([
            // { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.businessesService.getBusinessesByKey(key).subscribe({
                next: businesses => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = businesses
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.fetchData()
        this.fetchCount()
    }

    onUserChange() {
        const { assignedUserId } = this.formGroup.value
        Object.assign(this.params, { assignedUserId })
        this.fetchData()
        this.fetchCount()
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.businessesService.getBusinessesByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(businesses => {
            this.navigationService.loadBarFinish()
            this.dataSource = businesses
        })
    }

    fetchCount() {
        this.businessesService.getCountBusinesses(this.params).subscribe(count => {
            this.length = count
        })
    }

}
