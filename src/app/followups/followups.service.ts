import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { FollowupModel } from './followup.model';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class FollowupsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getFollowupById(followupId: string): Observable<FollowupModel> {
        return this.httpService.get(`followups/byId/${followupId}`)
    }

    getFollowupsByKey(key: string): Observable<FollowupModel[]> {
        return this.httpService.get(`followups/byKey`, { key })
    }

    getCountFollowups(params: Params): Observable<number> {
        return this.httpService.get('followups/countFollowups', params)
    }

    getCountDeletedFollowups(): Observable<number> {
        return this.httpService.get('followups/countDeletedFollowups')
    }


    getFollowupsByPage(pageIndex: number, pageSize: number, params: Params): Observable<FollowupModel[]> {
        return this.httpService.get(`followups/byPage/${pageIndex}/${pageSize}`, params)
    }

    getDeletedFollowupsByPage(pageIndex: number, pageSize: number): Observable<FollowupModel[]> {
        return this.httpService.get(`followups/deletedByPage/${pageIndex}/${pageSize}`)
    }

    create(followup: any): Observable<FollowupModel> {
        return this.httpService.post('followups', { followup })
    }

    update(
        followup: any,
        folloupId: string
    ): Observable<void> {
        return this.httpService.put(`followups/${folloupId}`, { followup })
    }

    delete(followupId: string): Observable<void> {
        return this.httpService.delete(`followups/${followupId}`)
    }

}
