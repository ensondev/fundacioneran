import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { catchError, map, Observable, of, retry, throwError } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private _http = inject(HttpClient);

    createUser(
        nombres_completo: string,
        apellidos_completos: string,
        nombre_usuario: string,
        fecha_nacimiento: string,
        genero: string,
        numero_telefono: string,
        correo: string,
        rol_usuario: string, 
        password: string
    ): Observable<any> {
        return this._http.post(`${environment.API_URL}/auth/register`, {
            nombres_completo,
            apellidos_completos,
            nombre_usuario,
            fecha_nacimiento,
            genero,
            numero_telefono,
            correo,
            rol_usuario,
            password
        }).pipe(
            map((res: any) => res.p_data || res),
            catchError(err => {
                console.error('Error en createUser:', err);
                return throwError(() => err);
            })
        );
    }

    getUsers(): Observable<any[]> {
        return this._http.get(`${environment.API_URL}/users`).pipe(
            map((res: any) => res.p_data.users || []),
            catchError(err => {
                console.error('Error en getUsers:', err);
                return of([]);
            })
        );
    }

    getUserName(nombre_usuario: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/users/name`, { nombre_usuario }).pipe(
            map((res: any) => res.p_data.users || res),
            catchError(err => {
                console.error('Error en createUser:', err);
                return throwError(() => err);
            })
        )
    }

    updateUser(data: any): Observable<any> {
        return this._http.put(`${environment.API_URL}/users/update`, data);
    }


    deleteUser(id_usuario: number): Observable<any> {
        return this._http.request('delete', `${environment.API_URL}/users/delete`, {
            body: { id_usuario }
        })
    };

}