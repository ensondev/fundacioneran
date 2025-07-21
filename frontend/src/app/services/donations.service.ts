// src/app/services/donor-service/donor.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DonationsService {
    private _http = inject(HttpClient);

    createDonations(
        id_donante: number,
        tipo_donacion: string,
        valor_estimado: number | null,
        metodo_pago: string | null,
        detalle_donacion: string,
        url_image: string | null,
        disponible: boolean | null,
    ): Observable<any> {
        return this._http.post(`${environment.API_URL}/donations/insert`, {
            id_donante,
            tipo_donacion,
            valor_estimado,
            metodo_pago,
            detalle_donacion,
            url_image,
            disponible
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(err => {
                console.error('Error en createDonations:', err);
                return of(null);
            })
        );
    }

    getDonations(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/donations`).pipe(
            map((response: any) => response.p_data?.donors || []),
            catchError((error) => {
                console.error('Error en getDonations:', error);
                return of([]);
            })
        );
    }

    getDonationsWithDonors(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/donations/with-donors`).pipe(
            map((res: any) => res.p_data?.donations_with_donor || []),
            catchError(error => {
                console.error('Error al obtener donaciones con donadores:', error);
                return of([]);
            })
        );
    }

}