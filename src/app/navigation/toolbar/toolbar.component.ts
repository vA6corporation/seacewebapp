import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { MaterialModule } from '../../material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.sass'
})
export class ToolbarComponent {

    constructor(
        private readonly navigationService: NavigationService,
        private readonly authService: AuthService,
        private readonly formBuilder: FormBuilder,
    ) { }

    formGroup: FormGroup = this.formBuilder.group({
        key: '',
    })
    @Output()
    sidenavToggle = new EventEmitter<void>()
    @ViewChild('inputKey')
    inputKey!: ElementRef<HTMLInputElement> | null
    title: string = 'LicitaMAS'
    isloadBar: boolean = true
    menus: any[] = []
    buttons: any[] = []
    showSearch: boolean = false
    showInputSearch: boolean = false
    isDebtor: boolean = false
    groupId: string = ''

    private handleChangeTitle$: Subscription = new Subscription()
    private handleIsLoadBar$: Subscription = new Subscription()
    private handleSetMenu$: Subscription = new Subscription()
    private handleShowSearch$: Subscription = new Subscription()
    private handleIsAuth$: Subscription = new Subscription()
    private handleAuth$: Subscription = new Subscription()

    ngOnDestroy() {
        this.handleChangeTitle$.unsubscribe()
        this.handleIsLoadBar$.unsubscribe()
        this.handleShowSearch$.unsubscribe()
        this.handleSetMenu$.unsubscribe()
        this.handleIsAuth$.unsubscribe()
        this.handleAuth$.unsubscribe()
    }

    ngOnInit() {
        this.handleChangeTitle$ = this.navigationService.handleChangeTitle().subscribe(title => {
            this.title = title
        })

        this.handleIsLoadBar$ = this.navigationService.handleIsLoadBar().subscribe(isloadBar => {
            this.isloadBar = isloadBar
        })

        this.handleIsAuth$ = this.authService.handleIsAuth().subscribe(isAuth => {
            if (isAuth) {
                this.isDebtor = this.authService.isDebtor()
                this.handleAuth$ = this.authService.handleAuth().subscribe(auth => {
                    this.groupId = auth.group._id
                })
            }
        })

        this.handleShowSearch$ = this.navigationService.handleShowSearch().subscribe(() => {
            this.showInputSearch = true
            setTimeout(() => {
                if (this.inputKey) {
                    this.inputKey.nativeElement.focus()
                }
            })
        })

        this.handleSetMenu$ = this.navigationService.handleSetMenu().subscribe(menus => {
            const filterMenus = []
            const filterButtons = []
            this.showSearch = false
            for (const menu of menus) {
                if (menu.id === 'search') {
                    this.showSearch = true
                    continue
                }
                if (menu.show) {
                    filterButtons.push(menu)
                } else {
                    filterMenus.push(menu)
                }
            }
            this.menus = filterMenus
            this.buttons = filterButtons
        })
    }

    onClickMenu(id: string) {
        if (id === 'search') {
            this.showSearch = !this.showSearch
        }
        this.navigationService.clickMenu(id)
    }

    onSubmit() {
        const { key } = this.formGroup.value
        this.formGroup.reset()
        if (key) {
            this.navigationService.search(key)
        }
    }

    onCloseInputSearch() {
        if (this.formGroup.value.key) {
            this.formGroup.reset()
        } else {
            this.showInputSearch = false
        }
    }

    onToggleSearch() {
        if (this.showSearch) {
            setTimeout(() => {
                if (this.inputKey) {
                    this.inputKey.nativeElement.focus()
                }
            })
        }
    }

    onToggleSidenav(): void {
        this.sidenavToggle.emit()
    }

}
