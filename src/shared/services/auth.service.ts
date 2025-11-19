import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    this.initGoogleAuth();
  }

  private initGoogleAuth(): void {
    // Load Google Sign-In library
    this.loadGoogleScript().then(() => {
      if (typeof google !== 'undefined') {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: this.handleCredentialResponse.bind(this)
        });
      }
    });
  }

  private loadGoogleScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  private handleCredentialResponse(response: any): void {
    const token = response.credential;
    const payload = this.parseJwt(token);
    
    const user: User = {
      uid: payload.sub,
      email: payload.email,
      displayName: payload.name,
      photoURL: payload.picture
    };

    this.userSubject.next(user);
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  public signInWithGoogle(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.prompt();
    } else {
      console.error('Google Sign-In not initialized');
    }
  }

  public signOut(): void {
    this.userSubject.next(null);
    if (typeof google !== 'undefined') {
      google.accounts.id.disableAutoSelect();
    }
  }

  public getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  public isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }
}

// Declare google for TypeScript
declare const google: any;
