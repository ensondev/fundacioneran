import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class BeneficiariesService {
    private _http = inject(HttpClient);

    registerBeneficiaries(
        nombres_beneficiario: string,
        cedula_beneficiario: string,
        direccion_beneficiario: string,
        telefono_beneficiario: string,
    ): Observable<any> {
        return this._http.post(`${environment.API_URL}/beneficiaries/insert`, {
            nombres_beneficiario,
            cedula_beneficiario,
            direccion_beneficiario,
            telefono_beneficiario
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(err => {
                console.log('Error en registerBeneficiaries:', err);
                return throwError(() => err);
            })
        );
    }

    getBeneficiaries(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/beneficiaries`).pipe(
            map((res: any) => res.p_data?.beneficiarios || []),
            catchError(err => {
                console.log('Error en getBeneficiaries:', err);
                return of([]);
            })
        );
    }
    
    getBeneficiarieByCedula(cedula_beneficiario: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/beneficiaries/cedula`, { cedula_beneficiario }).pipe(
            map((res: any) =>  {
                return res?.p_data?.beneficiario?.[0] || null;
            }),
            catchError(err => {
                console.error('Error en getBeneficiarieByCedula:', err);
                return of(null);
            })
        )
    }

    
    getBeneficiariesWithDeliveries(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/beneficiaries/with-deliveries`).pipe(
            map((res: any) => res.p_data?.beneficiaries_with_deliveries || []),
            catchError(err => {
                console.error('Error en getBeneficiariesWithDeliveries:', err);
                return of([]);
            })
        );
    }


    updateBeneficiarie(updateBeneficiarie: {
        id_beneficiario: number,
        nombres_beneficiario: string,
        cedula_beneficiario: string,
        direccion_beneficiario: string,
        telefono_beneficiario: string,
    }): Observable<any> {
        return this._http.put(`${environment.API_URL}/beneficiaries/update`, updateBeneficiarie);
    }

    deleteBeneficiarie(id_beneficiario: number): Observable<any> {
        return this._http.delete(`${environment.API_URL}/beneficiaries/delete`, {
            body: { id_beneficiario }
        });
    }
}