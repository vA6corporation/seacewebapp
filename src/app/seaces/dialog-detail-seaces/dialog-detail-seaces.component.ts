import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SeacesService } from '../seaces.service';
import { SeaceModel } from '../seace.model';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { NavigationService } from '../../navigation/navigation.service';

@Component({
  selector: 'app-dialog-detail-seaces',
  standalone: true,
  imports: [MaterialModule, CommonModule],
  templateUrl: './dialog-detail-seaces.component.html',
  styleUrl: './dialog-detail-seaces.component.sass'
})
export class DialogDetailSeacesComponent {

    constructor(
        @Inject(MAT_DIALOG_DATA)
        private readonly seaceId: string,
        private readonly seacesService: SeacesService,
        private readonly navigationService: NavigationService,
    ) { }

    seace: SeaceModel | null = null

    ngOnInit() {
        this.seacesService.getSeaceById(this.seaceId).subscribe(seace => {
            console.log(seace);
            
            this.seace = seace
        })
    }

    onClickCopy() {
        this.navigationService.showMessage('Copiado al portapapeles');
    }

}
