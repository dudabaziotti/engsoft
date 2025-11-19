# Authentication Service

This service provides Google Sign-In functionality for the application.

## Configuration

To use Google Sign-In, you need to:

1. **Create a Google OAuth Client ID:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API
   - Go to "Credentials" and create an OAuth 2.0 Client ID
   - Set the authorized JavaScript origins (e.g., `http://localhost:4200` for development)
   - Copy your Client ID

2. **Update the environment files:**
   - Open `src/environments/environment.ts` (for development)
   - Replace `'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'` with your actual Client ID
   - Do the same for `src/environments/environment.prod.ts` (for production)

## Usage

The `AuthService` provides the following methods:

- `signInWithGoogle()`: Initiates the Google Sign-In flow
- `signOut()`: Signs out the current user
- `getCurrentUser()`: Returns the current user or null
- `isAuthenticated()`: Returns true if a user is signed in
- `user$`: Observable that emits the current user state

## Example

```typescript
import { AuthService } from '../../../shared/services/auth.service';

export class MyComponent {
  constructor(private authService: AuthService) {
    this.authService.user$.subscribe(user => {
      if (user) {
        console.log('User is signed in:', user.displayName);
      } else {
        console.log('User is not signed in');
      }
    });
  }

  login() {
    this.authService.signInWithGoogle();
  }

  logout() {
    this.authService.signOut();
  }
}
```

## Security Notes

- Never commit your actual Google Client ID to a public repository
- Consider using environment variables or a configuration service for production deployments
- The current implementation uses Google's Identity Services library (GSI) which is the recommended approach
