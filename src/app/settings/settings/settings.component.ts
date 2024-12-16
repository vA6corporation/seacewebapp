import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { SettingsService } from '../settings.service';
import { GroupModel } from '../../auth/group.model';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [MaterialModule, RouterModule, ReactiveFormsModule, CommonModule],
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly settingsService: SettingsService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        group: this.formBuilder.group({
            name: ['', Validators.required],
            mobileNumber: ['', Validators.required],
            groupType: ['', Validators.required],
        })
    })
    disableUpdateStock = false
    isLoading: boolean = false
    baseUrl = environment.baseUrl
    group: GroupModel = new GroupModel()
    groupId: string = ''

    private handlePriceLists$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handlePriceLists$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit(): void {
        this.navigationService.setTitle('Ajustes')
        this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
            this.groupId = auth.group._id
            this.settingsService.getGroupById(this.groupId).subscribe(group => {
                console.log(group)
                this.group = group
                this.formGroup.patchValue({ group })
            })
        })
    }

    downloadFile(url: string, fileName: string) {
        const link = document.createElement("a")
        link.download = fileName
        link.href = url
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const { group } = this.formGroup.value
            this.navigationService.loadBarStart()
            this.settingsService.update(group, this.groupId).subscribe(() => {
                this.navigationService.loadBarFinish()
                this.navigationService.showMessage('Se han guardado los cambios')
                setTimeout(() => {
                    location.reload()
                }, 2000)
            })
        }
    }

}
