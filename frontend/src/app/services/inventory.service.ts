import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private _http = inject(HttpClient);

    InsertProdutInventory(producto_id: number | null, categoria_id: number | null, bodega_id: number | null, cantidad_disponible: number | null): Observable<any> {
        return this._http.post(`${environment.API_URL}/inventory/insert`, {
            producto_id,
            categoria_id,
            bodega_id,
            cantidad_disponible
        }).pipe(
            /* map((res: any) => res.p_data || res), */
            catchError(error => {
                console.error('Error en InsertProdutInventory', error);
                return throwError(() => error);
            })
        )
    }

    getProductsInventory(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/inventory`).pipe(
            map((res: any) => res.p_data.inventario || []),
            catchError(error => {
                console.error('Error en getProductsInventory:', error);
                return of([]);
            })
        )
    }

    updateProductInventory(producto_id: number | null, categoria_id: number | null, bodega_id: number | null, cantidad_disponible: number | null, id_inventario: number | null): Observable<any> {
        return this._http.put(`${environment.API_URL}/inventory/update`, {
            producto_id, categoria_id, bodega_id, cantidad_disponible, id_inventario
        });
    }

    updateStock(id_inventario: number, cantidadVendida: number) {
        return this._http.post(`${environment.API_URL}/inventory/update-stock`, {
            id_inventario,
            cantidadVendida
        });
    }

    deleteProductInventory(id_inventario: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/inventory/delete`, {
            body: { id_inventario }
        })
    }

}