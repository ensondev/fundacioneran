import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private _http = inject(HttpClient);

    insertSubject(nombre_materia: string, descripcion: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/subject/insert`, {
            nombre_materia, descripcion
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en insertSubject:', error);
                return throwError(() => error);
            })
        );
    }

    getSubject(): Observable<any[]>{
        return this._http.get(`${environment.API_URL}/subject`).pipe(
            map((res: any) => res.p_data.subject || []),
            catchError(error => {
                console.error('Error en getSubject:', error);
                return of([]);
            })
        );
    }

    deleteSubject(id_materia: number): Observable<any>{
        return this._http.request('delete', `${environment.API_URL}/subject/delete`, {
            body: {id_materia}
        })
    }
}