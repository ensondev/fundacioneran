import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class deliveriesService {
    private _http = inject(HttpClient);

    registerDeliveries(
        beneficiario_id: number,
        donacion_id: number,
    ): Observable<any> {
        return this._http.post(`${environment.API_URL}/deliveries/insert`, {
            beneficiario_id,
            donacion_id,
        }).pipe(
            map((response: any) => response.p_data || response),
            catchError(error => {
                console.error('Error en registerDeliveries', error);
                return of(null);
            })
        );
    }

    deleteDeliverie(id_entrega: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/deliveries/delete`, {
            body: { id_entrega }
        });
    }
}