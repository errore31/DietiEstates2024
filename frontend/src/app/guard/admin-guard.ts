import { CanActivateFn } from '@angular/router';
import { inject } from "@angular/core";
import { AuthService } from '../services/auth-service/auth';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { map } from 'rxjs/internal/operators/map';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return authService.checkAuth().pipe(
    map(isAuth => {
      const user = authService.currentUserSubject.value;
      
      if (!isAuth || !user || user.role !== 'admin') {
        toastr.error('Accesso riservato agli amministratori di sistema.', 'Accesso negato');
        router.navigate(['/']);
        return false;
      }

      return true;
    })
  );
};
