import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";
import { _getShadowRoot } from "@angular/cdk/platform";

@Injectable({
    providedIn: 'root'
})
export class InfantsService {
    private _http = inject(HttpClient);

    InsertInfant(
        nombres: string,
        cedula: string,
        genero: string,
        fecha_nacimiento: string,
        nombre_acudiente: string,
        cedula_acudiente: string,
        telefono_acudiente: string,
        direccion: string
    ): Observable<any> {
        return this._http.post(`${environment.API_URL}/infants/insert`, {
            nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en InsertInfant:', error);
                return throwError(() => error);
            })
        )
    }

    getInfants(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/infants`).pipe(
            map((res: any) => res.p_data?.infantes || []),
            catchError(error => {
                console.error('Error en getInfants:', error);
                return of([]);
            })
        )
    }

    getInfantsParams(cedula_infante: string, fecha_inicio: string, fecha_fin: string): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/infants/params`, {
            params: {
                cedula_infante, fecha_inicio, fecha_fin
            }
        }).pipe(
            map((res: any) => res.p_data?.infantes || []),
            catchError(error => {
                console.error('Error en getInfantsParams:', error);
                return of([]);
            })
        )
    }

    updateInfant(
        nombres: string,
        cedula: string,
        genero: string,
        fecha_nacimiento: string,
        nombre_acudiente: string,
        cedula_acudiente: string,
        telefono_acudiente: string,
        direccion: string,
        id_infante: number | null
    ): Observable<any> {
        return this._http.put(`${environment.API_URL}/infants/update`, {
            nombres, cedula, genero, fecha_nacimiento, nombre_acudiente, cedula_acudiente, telefono_acudiente, direccion, id_infante
        }).pipe(
            catchError(error => {
                console.error('Error en updateInfants:', error);
                return throwError(() => error);
            })
        )
    }

    deleteInfant(id_infante: number | null): Observable<any> {
        return this._http.delete(`${environment.API_URL}/infants/delete`, {
            body: { id_infante }
        })
    }
}