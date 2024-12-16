import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { IncomeModel } from '../income.model';
import { ShareholdersService } from '../shareholders.service';

@Component({
    selector: 'app-edit-shareholders',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './edit-shareholders.component.html',
    styleUrls: ['./edit-shareholders.component.sass']
})
export class EditShareholdersComponent implements OnInit {

    constructor(
        private readonly formBuilder: UntypedFormBuilder,
        private readonly shareholdersService: ShareholdersService,
        private readonly navigationService: NavigationService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        documentType: ['', Validators.required],
        document: ['', Validators.required],
        name: ['', Validators.required],
        email: '',
        nationality: ['', Validators.required],
        maritalStatus: ['', Validators.required],
        percent: ['', Validators.required],
        mobileNumber: '',
        birthDate: '',

        countryOrigin: '',
        addressResidence: '',
        countryResidence: '',
        districtResidence: '',
        provinceResidence: '',
        departmentResidence: '',

        professionOccupation: '',
        position: '',
        PEPInstitution: '',
        PEPPositionn: '',

        isPublicCompaniesCurrently: false,
        isPublicCompaniesLastFiveYear: false,
        publicCompaniesInstitute: '',
        publicCompaniesPosition: '',
        publicCompaniesTime: '',

        // Spouse
        documentTypeSpouse: '',
        documentSpouse: '',
        nameSpouse: '',
        nationalitySpouse: '',
        maritalStatusSpouse: '',
        birthDateSpouse: '',
    })
    isLoading: boolean = false
    maxlength: number = 11

    properties: any[] = []
    movableProperties: any[] = []
    incomes: IncomeModel[] = []
    investments: any[] = []
    private shareholderId: string = ''

    ngOnInit(): void {
        this.navigationService.setTitle('Editar accionista')

        this.formGroup.get('documentType')?.valueChanges.subscribe(value => {
            switch (value) {
                case 'RUC':
                    this.formGroup.get('documento')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)])
                    this.maxlength = 11
                    break
                case 'DNI':
                    this.formGroup.get('documento')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)])
                    this.maxlength = 8
                    break
            }
            this.formGroup.get('documento')?.updateValueAndValidity()
        })

        this.formGroup.get('documentTypeSpouse')?.valueChanges.subscribe(value => {
            switch (value) {
                case 'RUC':
                    this.formGroup.get('documentoSpouse')?.setValidators([Validators.required, Validators.minLength(11), Validators.maxLength(11)])
                    this.maxlength = 11
                    break
                case 'DNI':
                    this.formGroup.get('documentoSpouse')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)])
                    this.maxlength = 8
                    break
            }
            this.formGroup.get('documentoSpouse')?.updateValueAndValidity()
        })

        this.shareholderId = this.activatedRoute.snapshot.params['shareholderId']
        this.shareholdersService.getShareholdersById(this.shareholderId).subscribe(shareholder => {
            this.formGroup.patchValue(shareholder)
            this.properties = shareholder.properties
            this.movableProperties = shareholder.movableProperties
            this.incomes = shareholder.incomes
            this.investments = shareholder.investments
        })

    }

    onSubmit(): void {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            this.shareholdersService.update(this.formGroup.value, this.incomes, this.shareholderId).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/shareholders'])
                    this.navigationService.showMessage('Se han guardado los cambios')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
