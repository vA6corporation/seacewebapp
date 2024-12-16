import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { GroupModel } from '../auth/group.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getGroupById(groupId: string): Observable<GroupModel> {
        return this.httpService.get(`groups/byId/${groupId}`)
    }

    update(group: any, groupId: string): Observable<void> {
        return this.httpService.put(`groups/${groupId}`, { group })
    }

}
