import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { PartnershipItemModel } from './partnership-item.model';
import { PartnershipModel } from './partnership.model';

@Injectable({
    providedIn: 'root'
})
export class PartnershipsService {

    constructor(
        private readonly httpService: HttpService,
    ) { }

    getPartnershipsByKey(key: string): Observable<PartnershipModel[]> {
        return this.httpService.get(`partnerships/byKey/${key}`)
    }

    getPartnerships(): Observable<PartnershipModel[]> {
        return this.httpService.get('partnerships')
    }

    getPartnershipsByPage(pageIndex: number, pageSize: number, params: Params): Observable<PartnershipModel[]> {
        return this.httpService.get(`partnerships/byPage/${pageIndex}/${pageSize}`, params)
    }

    getCountPartnerships(params: Params): Observable<number> {
        return this.httpService.get('partnerships/countPartnerships', params)
    }

    getPartnershipById(partnershipId: string): Observable<PartnershipModel> {
        return this.httpService.get(`partnerships/byId/${partnershipId}`)
    }

    create(
        partnership: PartnershipModel
    ): Observable<PartnershipModel> {
        return this.httpService.post('partnerships', { partnership })
    }

    update(
        partnership: PartnershipModel, 
        partnershipId: string
    ): Observable<PartnershipModel> {
        return this.httpService.put(`partnerships/${partnershipId}`, { partnership })
    }

    delete(partnershipId: string): Observable<void> {
        return this.httpService.delete(`partnerships/${partnershipId}`)
    }

}
