import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { NotificationsService } from '../notifications.service';
import { NavigationService } from '../../navigation/navigation.service';
import { NotificationModel } from '../notification.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogDetailSeacesComponent } from '../../seaces/dialog-detail-seaces/dialog-detail-seaces.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../../auth/auth.service';
import { SeaceModel } from '../../seaces/seace.model';
import { DialogEditFollowupsComponent } from '../../followups/dialog-edit-followups/dialog-edit-followups.component';
import { DialogCreateFollowupsComponent } from '../../followups/dialog-create-followups/dialog-create-followups.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.sass'
})
export class NotificationsComponent {

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    displayedColumns: string[] = ['adjudicatedAt', 'nomenclature', 'objectContract', 'state', 'department', 'referenceValue', 'assignedUser', 'observations', 'actions']
    dataSource: NotificationModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup: FormGroup = this.formBuilder.group({
        objectContract: '',
        assignedUserId: ''
    })
    users: UserModel[] = []
    private orderBy: string = ''
    private params: Params = {}

    private handleIsAuth$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleIsAuth$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
        this.handleUsers$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Notificaciones')

        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(isAuth => {
            if (isAuth && this.authService.isDebtorCancel()) {
                this.router.navigate(['/subscription'])
            }
        })

        
        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.notificationsService.getNotificationsByKey(key).subscribe({
                next: notifications => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = notifications
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleClickMenu$ = this.navigationService.handleClickMenu().subscribe(id => {
            // switch (id) {
            //     case 'excel_simple':
            //         this.navigationService.loadBarFinish()
            //         const wscols = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
            //         let body = []
            //         body.push([
            //             'NOMBRE',
            //             'EMAIL',
            //         ])
            //         for (const user of this.dataSource) {
            //             body.push([
            //                 user.name,
            //                 user.email,
            //             ])
            //         }
            //         const name = `USUARIOS`
            //         buildExcel(body, name, wscols, [], [])
            //         break

            //     default:
            //         break
            // }
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.orderBy = auth.group.orderBy
            const queryParams = this.activatedRoute.snapshot.queryParams
            const { objectContract, pageIndex, pageSize } = queryParams
    
            // if (this.orderBy === '-publishedAt') {
            //     this.displayedColumns.splice(0, 0, 'publishedAt')
            // } else {
            //     this.displayedColumns.splice(1, 0, 'nomenclature')
            //     this.displayedColumns.splice(0, 0, 'adjudicatedAt')
            // }
    
            // if (objectContract) {
            //     this.formGroup.patchValue({ objectContract })
            //     Object.assign(this.params, { objectContract })
            // }
    
            if (pageIndex && pageSize) {
                this.pageIndex = Number(pageIndex)
                this.pageSize = Number(pageSize)
            }

            this.fetchData()
            this.fetchCount()
        })
    }

    onFollowup(seace: SeaceModel) {
        if (seace.followup) {
            const dialogRef = this.matDialog.open(DialogEditFollowupsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: seace.followup._id,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                }
            })
        } else {
            const dialogRef = this.matDialog.open(DialogCreateFollowupsComponent, {
                width: '600px',
                position: { top: '20px' },
                data: seace,
            })

            dialogRef.afterClosed().subscribe(ok => {
                if (ok) {
                    this.fetchData()
                }
            })
        }
    }

    onClickCopy() {
        this.navigationService.showMessage('Copiado al portapapeles');
    }

    fetchCount() {
        this.notificationsService.getCountNotifications(this.params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.notificationsService.getNotificationsByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(notifications => {
            this.navigationService.loadBarFinish()
            this.dataSource = notifications
        })
    }

    onDialogDetails(seaceId: string) {
        this.matDialog.open(DialogDetailSeacesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: seaceId,
        })
    }

    onOrderByChange() {
        const { orderBy } = this.formGroup.value
        Object.assign(this.params, { orderBy })

        this.pageIndex = 0

        const queryParams: Params = { pageIndex: 0, orderBy }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        if (orderBy === '-publishedAt') {
            this.displayedColumns.splice(0, 1, 'publishedAt')
        } else {
            this.displayedColumns.splice(0, 1, 'adjudicatedAt')
        }

        this.fetchData()
        this.fetchCount()
    }

    onUserChange() {
        const { assignedUserId } = this.formGroup.value
        Object.assign(this.params, { assignedUserId })

        this.pageIndex = 0

        const queryParams: Params = { pageIndex: 0, assignedUserId }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
    }

    onObjectContractChange() {
        const { objectContract } = this.formGroup.value
        Object.assign(this.params, { objectContract })

        this.pageIndex = 0

        const queryParams: Params = { pageIndex: 0, objectContract }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
        this.fetchCount()
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const queryParams: Params = { pageIndex: this.pageIndex, pageSize: this.pageSize }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
    }

}
