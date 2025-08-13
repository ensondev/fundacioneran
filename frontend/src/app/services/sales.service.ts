import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, combineLatest, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SalesMadeService {
    private _http = inject(HttpClient);

    insertHeader(nombre_cliente: string, cedula_cliente: string, total: number): Observable<any> {
        return this._http.post(`${environment.API_URL}/sales-header/insert`, {
            nombre_cliente,
            cedula_cliente,
            total
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en insertHeader:', error);
                return throwError(() => error);
            })
        )
    }

    insertDetails(detalle: {
        id_venta: number;
        id_inventario: number;
        cantidad: number;
        precio_unitario: number;
    }): Observable<any> {
        return this._http.post(`${environment.API_URL}/sales-details/insert`, detalle).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en insertDetails:', error);
                return throwError(() => error);
            })
        );
    }

    getSalesMade(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/sales-header`).pipe(
            map((res: any) => res.p_data.sales_header || []),
            catchError(error => {
                console.error('Error en getSalesMade:', error);
                return of([]);
            })
        )
    }
}