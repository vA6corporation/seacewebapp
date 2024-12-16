import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { UserModel } from '../../users/user.model';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidenav',
    standalone: true,
    imports: [MaterialModule, RouterModule],
    templateUrl: './sidenav.component.html',
    styleUrl: './sidenav.component.sass'
})
export class SidenavComponent {

    constructor(
        private readonly authService: AuthService,
    ) { }

    user: UserModel = new UserModel()

    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.user = auth.user
        })
    }

}
