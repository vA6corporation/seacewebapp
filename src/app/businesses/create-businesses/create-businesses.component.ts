import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { DialogCreateExperiencesComponent } from '../../experiences/dialog-create-experiences/dialog-create-experiences.component';
import { ExperienceModel } from '../../experiences/experience.model';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { UserModel } from '../../users/user.model';
import { UsersService } from '../../users/users.service';
import { BusinessesService } from '../businesses.service';
import { ShareholderModel } from '../../shareholders/shareholder.model';
import { DialogSearchShareholdersComponent } from '../../shareholders/dialog-search-shareholders/dialog-search-shareholders.component';
import { DialogEditExperiencesComponent } from '../../experiences/dialog-edit-experiences/dialog-edit-experiences.component';

@Component({
    selector: 'app-create-businesses',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './create-businesses.component.html',
    styleUrl: './create-businesses.component.sass'
})
export class CreateBusinessesComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly businessesService: BusinessesService,
        private readonly usersService: UsersService,
        private readonly formBuilder: FormBuilder,
        private readonly matDialog: MatDialog,
        private readonly router: Router
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        assignedUserId: ['', Validators.required],
        document: ['', Validators.required],
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        mobileNumber: '',
        observations: '',

        countryOrigin: '',
        districtOrigin: '',
        provinceOrigin: '',
        departmentOrigin: '',
        addressOrigin: '',

        countryRecidence: '',
        districtRecidence: '',
        provinceRecidence: '',
        departmentRecidence: '',
        addressRecidence: '',

        inscriptionAt: '',
        turnOfBusiness: '',
        sourcesOfIncome: '',
        countrySource: '',
        amountUse: '',
        UIF: '',
        hasComplianceOfficer: '',
        managementManualLAFT: '',
        codeEthicsConduct: '',
        carryReviewClients: '',
        madeMakeInvestments: '',
        companyEverBeenInvestigated: '',
        osceRegister: '',
        osceHiring: '',
        osceExpiration: '',
        osceCertifiedDate: '',
        osceObservation: '',

        representativeGender: '',
        representativeDocumentType: '',
        representativeDocument: '',
        representativeName: '',
        representativeStudies: '',
        representativeEmail: '',
        representativeCountryOrigin: '',
        representativeNationality: '',
        representativeCountryResidence: '',
        representativeDistrictResidence: '',
        representativeProvinceResidence: '',
        representativeDepartmentResidence: '',
        representativeAddressResidence: '',
        representativeLivingType: '',
        representativeLivingTypeIsPay: '',
        representativeLivingTypePrice: null,
        representativeMobileNumber: '',
        representativePhoneNumber: '',
        representativeMaritalStatus: '',
        representativeProfessionOccupation: '',
        representativePosition: '',
        representativeYearsOfService: '',
        representativeSalary: '',
        representativePEPInstitution: '',
        representativePEPPositionn: '',
        representativeCrimeStatus: '',
        representativeCrime: '',
        representativeCrimeYear: '',
        representativePropertyRegime: '',
        representativeBirthDate: '',

        representativeSpouseGender: '',
        representativeSpouseDocumentType: '',
        representativeSpouseDocument: '',
        representativeSpouseName: '',
        representativeSpouseNationality: '',
        representativeSpouseMaritalStatus: '',
        representativeSpouseBirthDate: '',
        representativeSpouseProfessionOccupation: '',
    })

    isLoading: boolean = false
    users: UserModel[] = []
    experiences: ExperienceModel[] = []
    shareholders: ShareholderModel[] = []

    private handleUsers$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleUsers$.unsubscribe()
    }

    ngOnInit() {
        this.navigationService.setTitle('Nueva empresa')

        this.handleUsers$ = this.usersService.handleUsers().subscribe(users => {
            this.users = users
        })
    }

    onDialogShareholders() {
        const dialogRef = this.matDialog.open(DialogSearchShareholdersComponent, {
            width: '600px',
            position: { top: '20px' }
        })

        dialogRef.afterClosed().subscribe(shareholder => {
            if (shareholder) {
                this.shareholders.push(shareholder)
            }
        })
    }

    onRemoveShareholder(index: number) {
        this.shareholders.splice(index, 1)
    }

    onDialogCreateExperiences() {
        const dialogRef = this.matDialog.open(DialogCreateExperiencesComponent, {
            width: '600px',
            position: { top: '20px' }
        })

        dialogRef.afterClosed().subscribe(experience => {
            if (experience) {
                this.experiences.push(experience)
            }
        })
    }

    onDialogEditExperiences(experience: ExperienceModel, index: number) {
        const dialogRef = this.matDialog.open(DialogEditExperiencesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: experience
        })

        dialogRef.afterClosed().subscribe(experience => {
            if (experience) {
                this.experiences.splice(index, 1, experience)
            }
        })
    }

    onDeleteExperience(index: number) {
        const ok = confirm('Estas seguro de aliminar?...')
        if (ok) {
            this.experiences.splice(index, 1)
        }
    }

    onSubmit() {
        if (this.formGroup.valid) {
            const business = this.formGroup.value
            business.shareholderIds = this.shareholders.map(e => e._id)
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.businessesService.create(this.formGroup.value, this.experiences).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage('Registrado correctamente')
                    this.router.navigate(['/businesses'])
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
