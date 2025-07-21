import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStateService } from "../service/auth-state.service";


// Guard para rutas privadas (requiere autenticación)
export const privateGuard: CanActivateFn = () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);
    const session = authStateService.getSession();

    if (!session) {
        router.navigate(['/auth/log-in']); // Usar navigate en lugar de navigateByUrl
        return false;
    }
    return true;
};

// Guard para rutas públicas (solo para no autenticados)
export const publicGuard: CanActivateFn = () => {
    const authStateService = inject(AuthStateService);
    const router = inject(Router);
    const session = authStateService.getSession();

    if (session) {
        router.navigate(['/home']); // Redirige a home si ya está autenticado
        return false;
    }
    return true;
};