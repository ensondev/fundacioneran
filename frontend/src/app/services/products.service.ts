import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class productsService {
    private _http = inject(HttpClient);

    registerProduct(
        es_caducible: boolean,
        nombre_producto: string | null,
        detalle_producto: string,
        categoria_id: number,
        fecha_caducidad: string | null,
        precio_venta: number,
    ): Observable<any> {
        return this._http.post(`${environment.API_URL}/products/register`, {
            es_caducible,
            nombre_producto,
            detalle_producto,
            categoria_id,
            fecha_caducidad,
            precio_venta
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en registerProduct:', error);
                return throwError(() => error);
            })
        )
    }

    getProducts(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/products`).pipe(
            map((res: any) => res.p_data.producto || []),
            catchError(err => {
                console.log('Error en getProducts:', err);
                return of([]);
            })
        )
    }

    getProductsWithCategories(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/products/with-categorie`).pipe(
            map((res: any) => res.p_data.producto || []),
            catchError(err => {
                console.log('Error en getProductsWithCategories:', err);
                return of([]);
            })
        )
    }

    updateProduct(
        id_producto: number,
        es_caducible: boolean,
        nombre_producto: string,
        detalle_producto: string,
        categoria_id: number,
        fecha_caducidad: string | null,
        precio_venta: number
    ): Observable<any> {
        return this._http.put(`${environment.API_URL}/products/update`, {
            id_producto,
            es_caducible,
            nombre_producto,
            detalle_producto,
            categoria_id,
            fecha_caducidad,
            precio_venta
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en updateProduct:', error);
                return throwError(() => error);
            })
        );
    }


    deleteProduct(id_producto: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/products/delete`, {
            body: { id_producto }
        })
    }
}