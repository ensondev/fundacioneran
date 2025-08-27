import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { animationFrameScheduler, catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { normalizePassiveListenerOptions } from "@angular/cdk/platform";

@Injectable({
    providedIn: 'root'
})
export class CashManagementService {
    private _http = inject(HttpClient);

    registerTransaction(tipo_transaccion: string, monto: number | null, razon: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/transactions/register`, {
            tipo_transaccion,
            monto,
            razon
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.log('Error en registerTransaction:', error);
                return throwError(() => error);
            })
        )
    }

    getTransaction(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/transactions`).pipe(
            map((res: any) => res.p_data.transaccion || []),
            catchError(error => {
                console.error('Error en getTransaction:', error);
                return of([]);
            })
        )
    }

    getIngresoSummary(): Observable<any> {
        return this._http.get(`${environment.API_URL}/transactions/summary/ingreso`).pipe(
            map((res: any) => res.p_data.ingreso || { total: 0, cantidad: 0 }),
            catchError(error => {
                console.error('Error en getIngresoSummary:', error);
                return of({ total: 0, cantidad: 0 });
            })
        );
    }

    getEgresoSummary(): Observable<any> {
        return this._http.get(`${environment.API_URL}/transactions/summary/egreso`).pipe(
            map((res: any) => res.p_data.egreso || { total: 0, cantidad: 0 }),
            catchError(error => {
                console.error('Error en getEgresoSummary:', error);
                return of({ total: 0, cantidad: 0 });
            })
        );
    }

    updateTransaction(
        tipo_transaccion: string,
        monto: number | null,
        razon: string,
        id_transaccion: number | null
    ): Observable<any> {
        return this._http.put(`${environment.API_URL}/transactions/update`, {
            tipo_transaccion, monto, razon, id_transaccion
        }).pipe(
            catchError(error => {
                console.error('Error en updateTransaction:', error);
                return throwError(() => error);
            })
        )
    }

    deleteTransaction(id_transaccion: number): Observable<any> {
        return this._http.delete(`${environment.API_URL}/transactions/delete`, {
            body: {id_transaccion}
        })
    }
}