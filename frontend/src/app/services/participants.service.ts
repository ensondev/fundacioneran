import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ParticipantsService {
    private _http = inject(HttpClient);

    insertParticipant(nombres: string, cedula: string, telefono: string, correo: string, direccion: string, fecha_nacimiento: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/participants/insert`, {
            nombres, cedula, telefono, correo, direccion, fecha_nacimiento
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.log('Error en insertParticipant:', error);
                return throwError(() => error);
            })
        )
    }

    getParticipants(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/participants`).pipe(
            map((res: any) => res.p_data?.participants || []),
            catchError(error => {
                console.error('Error en getParticipants:', error);
                return of([]);
            })
        )
    }

    updateParticipant(
        nombres: string,
        cedula: string,
        telefono: string,
        correo: string,
        direccion: string,
        fecha_nacimiento: string,
        id_participante: number | null
    ): Observable<any> {
        return this._http.put(`${environment.API_URL}/participants/update`, {
            nombres, cedula, telefono, correo, direccion, fecha_nacimiento, id_participante
        }).pipe(
            
        )
    }

    deleteParticipant(id_participante: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/participants/delete`, {
            body: { id_participante }
        })
    }
}