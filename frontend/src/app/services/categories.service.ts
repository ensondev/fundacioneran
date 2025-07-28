import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { catchError, map, Observable, of, throwError } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CategiriesService {
    private _http = inject(HttpClient);

    insertCategorie(nombre_categoria: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/categories/insert`, {
            nombre_categoria
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en insertCategorie:', error);
                return throwError(() => error);
            })
        );
    }

    getCategories(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/categorias`).pipe(
            map((res: any) => res.p_data.categorias || []),
            catchError(error => {
                console.error('Error en getCategories:', error);
                return of([]);
            })
        )

    }
}