import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from '../services/auth-service/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/operators';


export const authorizationAgencyGuard: CanActivateFn = () => {

    const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

    return authService.checkAuth().pipe(
      map(isAuth => {
    
        const user = authService.currentUserSubject.value;
        const allowedRoles = ['agencyAdmin', 'agent', 'admin'];

        // Controlla se l'utente è autenticato ha uno dei ruoli consentiti
        if (!isAuth || !user || !allowedRoles.includes(user.role)) {
          toastr.error('Non hai accesso a questa pagina.', 'Accesso negato');
          router.navigate(['/']);
          return false;
        }

        return true;
      })
    );
  };
