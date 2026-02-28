import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from '../services/auth-service/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

export const authorizationGuard: CanActivateFn = (route, state) => {

   const authService = inject(AuthService);
    const toastr = inject(ToastrService);
    const router = inject(Router);
    return authService.checkAuth().pipe(
      map(isAuth => {
            if (isAuth) {
                return true;
            } else {
                router.navigate(['/auth']);
                toastr.error('Esegui il login.', 'Accesso negato');
                return false;
            }
        }),
    );

};
