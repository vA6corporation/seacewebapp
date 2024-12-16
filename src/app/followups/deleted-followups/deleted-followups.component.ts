import { Component } from '@angular/core';
import { FollowupModel } from '../followup.model';
import { Subscription } from 'rxjs';
import { FollowupsService } from '../followups.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { PageEvent } from '@angular/material/paginator';

@Component({
    selector: 'app-deleted-followups',
    standalone: true,
    imports: [MaterialModule, CommonModule],
    templateUrl: './deleted-followups.component.html',
    styleUrl: './deleted-followups.component.sass'
})
export class DeletedFollowupsComponent {

    constructor(
        private readonly followupsService: FollowupsService,
        private readonly navigationService: NavigationService,
    ) { }

    displayedColumns: string[] = ['idProcess', 'publishedAt', 'adjudicatedAt', 'beneficiarie', 'assignedUser', 'observations', 'actions']
    dataSource: FollowupModel[] = []
    length: number = 0
    pageSize: number = 10
    pageSizeOptions: number[] = [10, 30, 50]
    pageIndex: number = 0

    private handleAuth$: Subscription = new Subscription()
    private handleClickMenu$: Subscription = new Subscription()
    private handleSearch$: Subscription = new Subscription()

    ngOnDestroy(): void {
        this.handleAuth$.unsubscribe()
        this.handleClickMenu$.unsubscribe()
        this.handleSearch$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Seguimientos')

        this.navigationService.setMenu([
            { id: 'excel_simple', label: 'Exportar excel', icon: 'file_download', show: false },
            { id: 'search', icon: 'search', show: true, label: '' },
        ])

        this.handleSearch$ = this.navigationService.handleSearch().subscribe(key => {
            // this.navigationService.loadBarStart()
            // this.followupsService.getfollowupsByKey(key).subscribe({
            //     next: followups => {
            //         this.navigationService.loadBarFinish()
            //         this.dataSource = followups
            //     }, error: (error: HttpErrorResponse) => {
            //         this.navigationService.loadBarFinish()
            //         this.navigationService.showMessage(error.error.message)
            //     }
            // })
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

        this.fetchData()
        this.fetchCount()
    }

    fetchCount() {
        this.followupsService.getCountDeletedFollowups().subscribe(count => {
            this.length = count
        })
    }

    fetchData() {
        this.navigationService.loadBarStart()
        this.followupsService.getDeletedFollowupsByPage(this.pageIndex + 1, this.pageSize).subscribe(followups => {
            this.navigationService.loadBarFinish()
            console.log(followups)
            this.dataSource = followups
        })
    }

    onRestoreFollowup(followup: FollowupModel) {
        this.navigationService.loadBarStart()
        followup.deletedAt = null
        this.followupsService.update(followup, followup._id).subscribe(() => {
            this.navigationService.loadBarFinish()
            this.dataSource = this.dataSource.filter(e => e._id !== followup._id)
        })
    }

    handlePageEvent(event: PageEvent): void {
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize
        this.fetchData()
    }

}
