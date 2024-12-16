import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
    imports: [
        MatSidenavModule,
        MatTableModule, 
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatDialogModule,
        MatSelectModule,
        MatListModule,
        MatCardModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatExpansionModule,
        ClipboardModule,
        MatChipsModule,
    ],
    exports: [
        MatSidenavModule,
        MatTableModule, 
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatTabsModule,
        MatDialogModule,
        MatSelectModule,
        MatListModule,
        MatCardModule,
        MatSlideToggleModule,
        MatFormFieldModule,
        MatProgressBarModule,
        MatToolbarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatDialogModule,
        MatExpansionModule,
        ClipboardModule,
        MatChipsModule,
    ]
})
export class MaterialModule { }
