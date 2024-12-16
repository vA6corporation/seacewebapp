import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { DialogSearchBeneficiariesComponent } from '../../beneficiaries/dialog-search-beneficiaries/dialog-search-beneficiaries.component';
import { DialogSearchBusinessesComponent } from '../../businesses/dialog-search-businesses/dialog-search-businesses.component';
import { MaterialModule } from '../../material.module';
import { NavigationService } from '../../navigation/navigation.service';
import { DialogEditGuarantiesComponent } from '../dialog-edit-guaranties/dialog-edit-guaranties.component';
import { GuaranteeModel } from '../guarantee.model';
import { TemplatesService } from '../templates.service';
import { DialogCreateGuarantiesComponent } from '../dialog-create-guaranties/dialog-create-guaranties.component';
import { PartnershipItemModel } from '../../partnerships/partnership-item.model';
import { DialogSearchPartnershipsComponent } from '../../partnerships/dialog-search-partnerships/dialog-search-partnerships.component';

@Component({
    selector: 'app-create-templates',
    standalone: true,
    imports: [MaterialModule, ReactiveFormsModule, RouterModule, CommonModule],
    templateUrl: './create-templates.component.html',
    styleUrls: ['./create-templates.component.sass']
})
export class CreateTemplatesComponent implements OnInit {

    constructor(
        private readonly templatesService: TemplatesService,
        private readonly navigationService: NavigationService,
        private readonly router: Router,
        private readonly matDialog: MatDialog,
        private readonly formBuilder: FormBuilder
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        objectDescription: ['', Validators.required],
        startAt: ['', Validators.required],
        executionPlace: ['', Validators.required],
        baseBudget: ['', Validators.required],
        contractAmount: ['', Validators.required],
        depositorName: '',
        daysLimit: ['', Validators.required],
        partnership: this.formBuilder.group({
            _id: null,
            name: '',
        }),
        business: this.formBuilder.group({
            _id: [null, Validators.required],
            name: ['', Validators.required],
        }),
        beneficiary: this.formBuilder.group({
            _id: [null, Validators.required],
            name: ['', Validators.required],
        }),
    })
    guaranties: any[] = []
    partnershipItems: PartnershipItemModel[] = []
    isLoading: boolean = false

    ngOnInit(): void {
        this.navigationService.setTitle('Nuevo formato')
    }

    onDialogSearchBusinesses() {
        const dialogRef = this.matDialog.open(DialogSearchBusinessesComponent, {
            width: '600px',
            position: { top: '20px' }
        })

        dialogRef.afterClosed().subscribe(business => {
            if (business) {
                this.formGroup.patchValue({ business });
            }
        })
    }

    onDialogSearchBeneficiaries() {
        const dialogRef = this.matDialog.open(DialogSearchBeneficiariesComponent, {
            width: '600px',
            position: { top: '20px' }
        })

        dialogRef.afterClosed().subscribe(beneficiary => {
            if (beneficiary) {
                this.formGroup.patchValue({ beneficiary })
            }
        })
    }

    onDialogCreateGuaranties() {
        const dialogRef = this.matDialog.open(DialogCreateGuarantiesComponent, {
            width: '600px',
            position: { top: '20px' },
        })

        dialogRef.afterClosed().subscribe(guarantee => {
            if (guarantee) {
                this.guaranties.push(guarantee)
            }
        })
    }

    onRemoveGuarantee(index: number) {
        this.guaranties.splice(index, 1)
    }

    onDialogEditGuarantee(guarantee: GuaranteeModel, index: number) {
        const dialogRef = this.matDialog.open(DialogEditGuarantiesComponent, {
            width: '600px',
            position: { top: '20px' },
            data: guarantee,
        })

        dialogRef.afterClosed().subscribe(guarantee => {
            if (guarantee) {
                this.guaranties.splice(index, 1, guarantee)
            }
        })
    }

    onDialogSearchPartnerships() {
        const dialogRef = this.matDialog.open(DialogSearchPartnershipsComponent, {
            width: '600px',
            position: { top: '20px' }
        })

        dialogRef.afterClosed().subscribe(partnership => {
            if (partnership) {
                const { business, partnershipItems } = partnership
                this.partnershipItems = partnershipItems
                this.formGroup.patchValue({ business })
                this.formGroup.patchValue({ partnership })
            }
        })
    }

    async onSubmit() {
        if (this.formGroup.valid) {
            this.isLoading = true
            this.navigationService.loadBarStart()
            const { business, partnership, beneficiary, ...template } = this.formGroup.value
            template.businessId = business._id
            template.partnershipId = partnership._id
            template.beneficiaryId = beneficiary._id
            this.templatesService.create(template, this.guaranties).subscribe({
                next: () => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.router.navigate(['/templates'])
                    this.navigationService.showMessage('Registrado correctamente')
                }, error: (error: HttpErrorResponse) => {
                    this.isLoading = false
                    this.navigationService.loadBarFinish()
                    this.navigationService.showMessage(error.error.message)
                }
            })
        }
    }

}
