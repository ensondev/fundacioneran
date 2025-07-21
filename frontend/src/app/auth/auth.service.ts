import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { StorageService } from "../shared/service/storage.service";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _http = inject(HttpClient);
    private _storage = inject(StorageService);

    logIn(nombre_usuario: string, password: string): Observable<any> {
        return this._http.post(`${environment.API_URL}/auth/login`, { nombre_usuario, password }).pipe(
            tap((response: any) => {
                if (response.p_status && response.p_data) {
                    this._storage.set('session', response.p_data);
                }
            })
        );
    }

    /*     signUp(nombre_usuario: string, rol_usuario: string, password: string): Observable<any> {
            return this._http.post(`${environment.API_URL}/auth/sign-up`, {nombre_usuario, rol_usuario, password}).pipe(
                tap((response: any) => {
                    if (response.p_status && response.p_data) {
                        this._storage.set('session', response.p_data);
                    }
                })
            );
        } */


}