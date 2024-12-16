import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { MaterialModule } from './material.module';
import { NavigationService } from './navigation/navigation.service';
import { SidenavComponent } from './navigation/sidenav/sidenav.component';
import { ToolbarComponent } from './navigation/toolbar/toolbar.component';
import { DialogNotificationsComponent } from './notifications/dialog-notifications/dialog-notifications.component';
import { NotificationsService } from './notifications/notifications.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [MaterialModule, RouterOutlet, ToolbarComponent, SidenavComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.sass'
})
export class AppComponent {

    constructor(
        private readonly notificationsService: NotificationsService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly matDialog: MatDialog,
        private readonly router: Router,
    ) { }

    title = 'LicitaMAS'
    isStart: boolean = false
    isAuth: boolean = false
    currentPath: string = ''
    isOffline: boolean = false

    ngOnInit(): void {
        const urlParams = new URLSearchParams(window.location.search)
        const accessToken = urlParams.get('accessToken') || localStorage.getItem('accessToken')

        this.authService.handleIsAuth().subscribe(isAuth => {
            this.isAuth = isAuth
            if (this.isAuth) {
                this.authService.handleAuth().subscribe(auth => {
                    if (!this.authService.isDebtorCancel()) {
                        this.notificationsService.getNotificationsByPage(1, 15, { assignedUserId: auth.user._id })
                            .subscribe(notifications => {
                                if (notifications.length) {
                                    this.matDialog.open(DialogNotificationsComponent, {
                                        width: '600px',
                                        position: { top: '20px' },
                                        data: notifications
                                    })
                                }
                            })
                    }
                })
            }
        })

        const $events = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                $events.unsubscribe()
                const queryParams = this.activatedRoute.snapshot.queryParams
                if (queryParams['email'] && queryParams['password']) {
                    this.isStart = true
                    this.authService.login(queryParams['email'], queryParams['password']).subscribe({
                        next: auth => {
                            const {
                                accessToken,
                                user,
                                group,
                            } = auth
                            this.navigationService.loadBarFinish()
                            this.authService.setAccessToken(accessToken)
                            this.authService.setAuth(user, group)
                            this.router.navigate(['/'])
                            this.authService.loggedIn()
                            this.isStart = true
                        }, error: (error: HttpErrorResponse) => {
                            this.navigationService.loadBarFinish()
                            this.isStart = true
                        }
                    })
                } else {
                    this.authService.setAccessToken(accessToken)
                    this.authService.getSession().subscribe({
                        next: auth => {
                            const { user, group } = auth
                            this.authService.setAuth(user, group)
                            this.navigationService.loadBarFinish()
                            this.authService.loggedIn()
                            this.isStart = true
                        }, error: () => {
                            this.router.navigate(['/login'])
                            this.navigationService.loadBarFinish()
                            this.isStart = true
                        }
                    })
                }
            }
        })

        this.router.events.forEach(event => {
            if (event instanceof NavigationEnd) {
                if (this.currentPath !== this.router.url.split('?')[0]) {
                    this.navigationService.setMenu([])
                }
                this.currentPath = this.router.url.split('?')[0]
            }
        })
    }
}

