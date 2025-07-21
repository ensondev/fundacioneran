import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { AuthStateService } from "../service/auth-state.service";

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
    const authState = inject(AuthStateService);
    const router = inject(Router);
    const token = authState.getSession();
    
    // Clonar la solicitud y añadir el encabezado de autorización si existe el token
    if (token?.token) {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token.token}`
            }
        });
    }

    return next(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                authState.signOut();
                router.navigateByUrl('/auth/log-in');
            }
            return throwError(() => error);
        })
    );
};