import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { UserModel } from '../users/user.model';
import { AuthModel } from './auth.model';
import { GroupModel } from './group.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    private auth: AuthModel = {
        user: new UserModel(),
        group: new GroupModel(),
    }
    private isAuth$: BehaviorSubject<boolean> = new BehaviorSubject(false)
    private auth$ = new BehaviorSubject<AuthModel|null>(null)

    isDebtor(): boolean {
        const date = new Date()
        const paymentDate = new Date(this.auth.group.paymentAt)
        const utcDate = new Date(paymentDate.getUTCFullYear(), paymentDate.getUTCMonth(), paymentDate.getUTCDate())
        date.setHours(0, 0, 0, 0)
        paymentDate.setHours(0, 0, 0, 0)
        const diff = date.getTime() >= utcDate.getTime()
        return diff
    }

    isDebtorCancel(): boolean {
        const date = new Date()
        const paymentDate = new Date(this.auth.group.paymentAt)
        const utcDate = new Date(paymentDate.getUTCFullYear(), paymentDate.getUTCMonth(), paymentDate.getUTCDate())
        date.setHours(0, 0, 0, 0)
        paymentDate.setHours(0, 0, 0, 0)
        utcDate.setDate(utcDate.getDate() + 5)
        const diff = date.getTime() >= utcDate.getTime()
        return diff
    }

    handleAuth(): Observable<AuthModel> {
        return this.auth$.pipe(filter(e => e !== null))
    }

    setAuth(
        user: UserModel,
        group: GroupModel,
    ): void {
        this.auth = {
            user,
            group,
        }
        this.auth$.next(this.auth)
    }

    setUser(user: UserModel) {
        if (this.auth) {
            this.auth.user = user
        }
    }

    getAuth(): AuthModel | null {
        return this.auth
    }

    handleIsAuth() {
        return this.isAuth$.asObservable()
    }

    loggedIn() {
        this.isAuth$.next(true)
    }

    loggedOut() {
        this.isAuth$.next(false)
    }

    setAccessToken(accessToken: string | null): void {
        this.httpService.accessToken = accessToken
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken)
        } else {
            localStorage.setItem('accessToken', '')
        }
    }

    login(email: string, password: string): Observable<any> {
        return this.httpService.post('auth/login', { email, password })
    }

    signup(business: any, office: any, user: any): Observable<any> {
        return this.httpService.post('signup', { business, office, user })
    }

    logout(): void {
        this.setAccessToken(null)
        location.reload()
    }

    getSession(): Observable<any> {
        return this.httpService.get('auth/profile')
    }

}
