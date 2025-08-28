import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class InstructorsService {
    private _http = inject(HttpClient);

    insertInstructor(nombres: string, cedula: string, telefono: string, correo: string, especialidad: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/instructors/insert`, {
            nombres, cedula, telefono, correo, especialidad
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en insertInstructor:', error);
                return throwError(() => error);
            })
        );
    }

    getInstructors(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/instructors`).pipe(
            map((res: any) => res.p_data?.instructores || []),
            catchError(error => {
                console.error('Error en getInstructors:', error);
                return of([]);
            })
        )
    }

    updateInstructor(
        nombres: string,
        cedula: string,
        telefono: string,
        correo: string,
        especialidad: string,
        id_instructor: number | null
    ): Observable<any> {
        return this._http.put(`${environment.API_URL}/instructors/update`, {
            nombres, cedula, telefono, correo, especialidad, id_instructor
        }).pipe(
            catchError(error => {
                console.log('Error en updateInstructor:', error);
                return throwError(() => error);
            })
        )
    }

    deleteInstructor(id_instructor: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/instructors/delete`, {
            body: { id_instructor }
        })
    }
}