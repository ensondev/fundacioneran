// src/app/services/donor-service/donor.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DonorsService {

    private _http = inject(HttpClient);

    createDonor(nombres: string, numero_identificacion: string, telefono: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/donor/insert`, {
            nombres,
            numero_identificacion,
            telefono
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(err => {
                console.error('Error en createDonor:', err);
                return of(null);
            })
        );
    }

    getDonors(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/donor`).pipe(
            map((response: any) => response.p_data?.donors || []),
            catchError((error) => {
                console.error('Error en getDonors:', error);
                return of([]);
            })
        );
    }

    getDonorByCedula(numero_identificacion: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/donor/cedula`, { numero_identificacion }).pipe(
            map((res: any) => res.p_data?.donor?.[0] || null), // ← selecciona el primer elemento
            catchError(err => {
                console.error('Error en getDonorByCedula:', err);
                return of(null);
            })
        );
    }

    updateDonor(updatedDonor: {
        id_donante: number;
        nombres: string;
        numero_identificacion: string;
        telefono: string;
    }): Observable<any> {
        return this._http.put(`${environment.API_URL}/donor/update`, updatedDonor);
    }

    deleteDonor(id_donante: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/donor/delete`, {
            body: { id_donante }
        });
    }
}