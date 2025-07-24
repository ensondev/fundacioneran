import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, retry } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private _http = inject(HttpClient);

    createUser(nombre_usuario: string, rol_usuario: string, password: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/auth/register`, {
            nombre_usuario,
            rol_usuario,
            password
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(err => {
                console.error('Error en createUser:', err);
                return of(null);
            })
        );
    }

    getUsers(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/users`).pipe(
            map((res: any) => res.p_data.users || []),
            catchError(err => {
                console.error('Error en getUsers:', err);
                return of([])
            })
        );
    }

/*     updateUser(nombre_usuario: string, password: string, id_usuario: number): Observable<any> {
        return this._http.put(`${environment.API_URL}/users/update`, {
            nombre_usuario,
            password,
            id_usuario
        });
    } */

    updateUser(data: any): Observable<any> {
        return this._http.put(`${environment.API_URL}/users/update`, data);
    }


    deleteUser(id_usuario: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/users/delete`, {
            body: { id_usuario }
        })
    };

}