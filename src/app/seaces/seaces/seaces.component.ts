import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogCreateFollowupsComponent } from '../../followups/dialog-create-followups/dialog-create-followups.component';
import { DialogEditFollowupsComponent } from '../../followups/dialog-edit-followups/dialog-edit-followups.component';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogDetailSeacesComponent } from '../dialog-detail-seaces/dialog-detail-seaces.component';
import { SeaceModel } from '../seace.model';
import { SeacesService } from '../seaces.service';
import { AuthService } from '../../auth/auth.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';

@Component({
    selector: 'app-seaces',
    standalone: true,
    imports: [MaterialModule, RouterModule, ReactiveFormsModule, CommonModule],
    templateUrl: './seaces.component.html',
    styleUrl: './seaces.component.sass'
})
export class SeacesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly seacesService: SeacesService,
        private readonly formBuilder: FormBuilder,
        private readonly activatedRoute: ActivatedRoute,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    displayedColumns: string[] = ['adjudicatedAt', 'nomenclature', 'objectContract', 'state', 'department', 'referenceValue', 'assignedUser', 'observations', 'actions']
    dataSource: SeaceModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 20]
    pageIndex: number = 0
    params: Params = { orderBy: '-publishedAt' }
    formGroup: FormGroup = this.formBuilder.group({
        state: '',
        objectContracts: [],
        department: '',
    })
    orderBy: string = ''
    users: UserModel[] = []

    private handleSearch$: Subscription = new Subscription()
    private handleIsAuth$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()
    private handleUsers$: Subscription = new Subscription()

    departments: string[] = [
        'AMAZONAS',
        'ANCASH',
        'APURIMAC',
        'AREQUIPA',
        'AYACUCHO',
        'CAJAMARCA',
        'CALLAO',
        'CUSCO',
        'EXTERIOR',
        'HUANCAVELICA',
        'HUANUCO',
        'ICA',
        'JUNIN',
        'LA LIBERTAD',
        'LAMBAYEQUE',
        'LIMA',
        'LORETO',
        'MADRE DE DIOS',
        'MOQUEGUA',
        'MULTIDEPARTAMENTAL',
        'PASCO',
        'PIURA',
        'PUNO',
        'SAN MARTIN',
        'TACNA',
        'TUMBES',
        'UCAYALI'
    ]

    ngOnDestroy() {
        this.handleSearch$.unsubscribe()
        this.handleIsAuth$.unsubscribe()
        this.handleAuth$.unsubscribe()
        this.handleUsers$.unsubscribe()
    }

    ngOnInit() {
        this.navigationService.setTitle('Busqueda')
        this.navigationService.showSearch()

        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(isAuth => {
            if (isAuth && this.authService.isDebtorCancel()) {
                this.router.navigate(['/subscription'])
            }
        })

        this.navigationService.setMenu([
            { id: 'search', label: 'Buscar', icon: 'search', show: true },
            // { id: 'excel_simple', label: 'Exportar Excel', icon: 'file_download', show: false },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            this.navigationService.loadBarStart()
            this.seacesService.getSeacesByKey(key, this.params).subscribe({
                next: seaces => {
                    this.navigationService.loadBarFinish()
                    this.dataSource = seaces
                }, error: (error: HttpErrorResponse) => {
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        })

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })

        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.orderBy = auth.group.orderBy
            const queryParams = this.activatedRoute.snapshot.queryParams
            const { objectContract, department, pageIndex, pageSize } = queryParams

            if (objectContract) {
                this.formGroup.patchValue({ objectContract })
                Object.assign(this.params, { objectContract })
            }

            if (department) {
                this.formGroup.patchValue({ department })
                Object.assign(this.params, { department })
            }

            if (pageIndex && pageSize) {
                this.pageIndex = Number(pageIndex)
                this.pageSize = Number(pageSize)
            }

            this.fetchData()
            this.fetchCount()
        })
    }

    onClickCopy() {
        this.navigationService.showMessage('Copiado al portapapeles')
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

    onDialogDetailSeaces(seaceId: string) {
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
            const indexOf = this.displayedColumns.indexOf('adjudicatedAt')
            this.displayedColumns.splice(indexOf, 1, 'publishedAt')
        } else {
            const indexOf = this.displayedColumns.indexOf('publishedAt')
            this.displayedColumns.splice(indexOf, 1, 'adjudicatedAt')
        }

        this.fetchData()
    }

    onStateChange() {
        this.pageIndex = 0

        const { state } = this.formGroup.value
        const queryParams: Params = { state, pageIndex: 0 }

        Object.assign(this.params, queryParams)
        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchCount()
        this.fetchData()
    }

    onObjectContractChange() {
        const { objectContracts } = this.formGroup.value
        Object.assign(this.params, { objectContracts })

        this.pageIndex = 0

        const queryParams: Params = { pageIndex: 0, objectContracts }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
    }

    onDepartmentChange() {
        const { department } = this.formGroup.value
        Object.assign(this.params, { department })

        this.pageIndex = 0

        const queryParams: Params = { pageIndex: 0, department }

        this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            queryParamsHandling: 'merge', // remove to replace all query params by provided
        })

        this.fetchData()
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

    fetchCount() {
        this.seacesService.getCountSeaces().subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.seacesService.getSeacesByPage(this.pageIndex + 1, this.pageSize, this.params).subscribe(seaces => {
            this.navigationService.loadBarFinish()
            this.dataSource = seaces
        })
    }

}
