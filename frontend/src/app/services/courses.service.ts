import { HttpClient } from "@angular/common/http";
import { inject, Inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class CoursesService {
    private _http = inject(HttpClient);

    insertCourse(materia_id: number | null, instructor_id: number | null, descripcion: string, fecha_inicio: string, fecha_fin: string, cupo_maximo: number | null): Observable<any> {
        return this._http.post(`${environment.API_URL}/courses/insert`, {
            materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(error => {
                console.error('Error en insertCourse:', error);
                return throwError(() => error);
            })
        )
    }

    getCourses(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/courses`).pipe(
            map((res: any) => res.p_data.courses || []),
            catchError(error => {
                console.error('Error en getCourses:', error);
                return of([]);
            })
        )
    }

    updateCourse(
        materia_id: number | null,
        instructor_id: number | null,
        descripcion: string,
        fecha_inicio: string,
        fecha_fin: string,
        cupo_maximo: number | null,
        id_curso: number | null
    ): Observable<any> {
        return this._http.put(`${environment.API_URL}/courses/update`, {
            materia_id, instructor_id, descripcion, fecha_inicio, fecha_fin, cupo_maximo, id_curso
        }).pipe(
            catchError(error => {
                console.log('Error en updateCourse:', error);
                return throwError(() => error);
            })
        )
    }

    updateAvailabilityCourse(activo: boolean, id_curso: number | null): Observable<any> {
        return this._http.put(`${environment.API_URL}/courses/update-availability`, {
            activo, id_curso
        }).pipe(
            catchError(error => {
                console.log('Error en updateAvailabilityCourse:', error);
                return throwError(() => error);
            })
        )
    }

    deleteCourse(id_curso: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/courses/delete`, {
            body: { id_curso }
        })
    }
}