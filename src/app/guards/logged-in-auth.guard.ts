import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { loggedIn } from '@angular/fire/auth-guard';

@Injectable()
export class LoggedInAuthGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }

    canActivate(): boolean {
        if (this.auth.isLoggedIn()) {
            this.router.navigate(['/dashboard']);
            return false;
        } else {
            return true;
        }
    }
}
