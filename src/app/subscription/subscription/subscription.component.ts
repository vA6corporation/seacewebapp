import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NavigationService } from '../../navigation/navigation.service';
import { MaterialModule } from '../../material.module';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-subscription',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './subscription.component.html',
    styleUrls: ['./subscription.component.sass']
})
export class SubscriptionComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly router: Router
    ) { }

    groupId: string = ''
    private handleIsAuth$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleIsAuth$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Renueve la suscripcion')

        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(isAuth => {
            if (isAuth && !this.authService.isDebtorCancel()) {
                this.router.navigate(['/'])
            }
            if (isAuth) {
                this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
                    this.groupId = auth.group._id
                })
            }
        })
    }

}
