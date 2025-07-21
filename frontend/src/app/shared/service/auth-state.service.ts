import { inject, Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

interface Session {
    usuario: string,
    rol: string,
    token: string,
}

@Injectable({
    providedIn: 'root',
})
export class AuthStateService {
    private readonly SESSION_KEY = 'app_session';
    private _storageService = inject(StorageService);

    signOut() {
        this._storageService.remove('session');
    }

    getSession(): Session | null {
        const session = this._storageService.get<Session>('session');
        /* console.log('[AuthStateService] Sesión guardada:', session); */
        return this._isValidSession(session) ? session : null;
    }

    setSession(session: Session): void {
        this._storageService.set('session', session);
    }


    private _isValidSession(maybeSession: unknown): maybeSession is Session {
        if (typeof maybeSession !== 'object' || maybeSession === null) {
            return false;
        }

        const session = maybeSession as Session;
        return (
            typeof session.usuario === 'string' &&
            typeof session.rol === 'string' &&
            typeof session.token === 'string'
        );
    }
}