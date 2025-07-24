import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class WarehouseService {
    private _http = inject(HttpClient);

    createWarehouse(nombre_bodega: string, ubicacion: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/warehouse/insert`, {
            nombre_bodega,
            ubicacion,
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en createWarehouse:', error);
                return of(null);
            })
        );
    }

    getWarehouse(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/warehouse`).pipe(
            map((res: any) => res.p_data.bodega || []),
            catchError(err => {
                console.error('Error en getWarehouse:', err);
                return of([]);
            })
        );
    }

    updateWarehouse(nombre_bodega: string, ubicacion: string, id_bodega: number): Observable<any> {
        return this._http.put(`${environment.API_URL}/warehouse/update`, { nombre_bodega, ubicacion, id_bodega })
    }

    deleteWarehouse(id_bodega:number): Observable<any>{
        return this._http.request('delete',`${environment.API_URL}/warehouse/delete`, {
            body: {id_bodega}
        });
    }
}