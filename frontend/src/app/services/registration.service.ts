import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class RegistrationsService {
    private _http = inject(HttpClient);

    insertRegistration(participante_id: number | null, curso_id: number | null): Observable<any> {
        return this._http.post(`${environment.API_URL}/registrations/insert`, {
            participante_id, curso_id
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en insertRegistration:', error);
                return throwError(() => error);
            })
        )
    }

    getRegistrations(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/registrations`).pipe(
            map((res: any) => res.p_data.registrations || []),
            catchError(error => {
                console.error('Error en getRegistrations:', error);
                return of([]);
            })
        )
    }

    updateRegistration(
        participante_id: number | null,
        curso_id: number | null,
        id_inscripcion: number | null
    ): Observable<any> {
        return this._http.put(`${environment.API_URL}/registrations/update`, {
            participante_id, curso_id, id_inscripcion
        }).pipe(
            catchError(error => {
                console.error('Error en updateRegistration:', error);
                return throwError(() => error);
            })
        )
    }

    deleteRegistration(id_inscripcion: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/registrations/delete`, {
            body: { id_inscripcion }
        })
    }
}