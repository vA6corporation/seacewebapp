import { Component } from '@angular/core';
import { FollowupsService } from '../followups.service';
import { NavigationService } from '../../navigation/navigation.service';
import { FollowupModel } from '../followup.model';
import { Subscription } from 'rxjs';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { DialogDetailSeacesComponent } from '../../seaces/dialog-detail-seaces/dialog-detail-seaces.component';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogEditFollowupsComponent } from '../dialog-edit-followups/dialog-edit-followups.component';
import { AuthService } from '../../auth/auth.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-followups',
  standalone: true,
  imports: [MaterialModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './followups.component.html',
  styleUrl: './followups.component.sass'
})
export class FollowupsComponent {

    constructor(
        private readonly followupsService: FollowupsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    displayedColumns: string[] = ['adjudicatedAt', 'nomenclature', 'objectContract', 'state', 'department', 'referenceValue', 'assignedUser', 'observations', 'actions']
    dataSource: FollowupModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0
    formGroup: FormGroup = this.formBuilder.group({
        assignedUserId: '',
        objectContract: '',
        department: '',
    })
    users: UserModel[] = []
    private params: Params = {}
    private orderBy: string = ''

    private handleIsAuth$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleIsAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Seguimientos')

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
            this.followupsService.getFollowupsByKey(key).subscribe({
                next: followups => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = followups
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

    onClickCopy() {
        this.navigationService.showMessage('Copiado al portapapeles');
    }

    fetchCount() {
        this.followupsService.getCountFollowups(this.params).subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.followupsService.getFollowupsByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(followups => {
            this.navigationService.loadBarFinish()
            this.dataSource = followups
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
            // const indexOf = this.displayedColumns.indexOf('adjudicatedAt')
            this.displayedColumns.splice(0, 1, 'publishedAt')
        } else {
            // const indexOf = this.displayedColumns.indexOf('publishedAt')
            this.displayedColumns.splice(0, 1, 'adjudicatedAt')
        }

        this.fetchData()
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

    onDialogDetails(seaceId: string) {
        this.matDialog.open(DialogDetailSeacesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: seaceId,
        })
    }

    onDialogEdit(followupId: string) {
        const dialogRef = this.matDialog.open(DialogEditFollowupsComponent, {
            width: '600px',
            position: { top: '20px' },
            data: followupId,
        })

        dialogRef.afterClosed().subscribe(ok => {
            if (ok) {
                this.fetchData()
            }
        })
    }

    onDeleteFollowup(followupId: string) {
        const ok = confirm('Estas seguro de archivar?...')
        if (ok) {
            this.navigationService.loadBarStart()
            this.followupsService.delete(followupId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.dataSource = this.dataSource.filter(e => e._id !== followupId)
            })
        }
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
