import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { SeaceModel } from './seace.model';
import { Params } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class SeacesService {

    constructor(
        private readonly httpService: HttpService
    ) { }

    getCountSeaces(): Observable<number> {
        return this.httpService.get(`seaces/countSeaces`)
    }

    getSeaceById(
        seaceId: string,
    ): Observable<SeaceModel> {
        return this.httpService.get(`seaces/byId/${seaceId}`)
    }

    getSeacesByPage(
        pageIndex: number,
        pageSize: number,
        params: Params,
    ): Observable<SeaceModel[]> {
        return this.httpService.get(`seaces/byPage/${pageIndex}/${pageSize}`, params)
    }

    getSeacesByKey(key: string, params: Params) {
        return this.httpService.get(`seaces/byKey`, { key, ...params })
    }

}
