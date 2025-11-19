import { Component } from '@angular/core';
import { AuthService, User } from '../../../shared/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  user$: Observable<User | null>;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

  signInWithGoogle(): void {
    this.authService.signInWithGoogle();
  }

  signOut(): void {
    this.authService.signOut();
  }
}
