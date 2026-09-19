import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  private checkAuthStatus(): void {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    this.isAuthenticatedSubject.next(isAuth);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(username: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Simuler une vérification d'authentification
      setTimeout(() => {
        if (username === 'Administrator' && password === 'ness123.') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('currentUser', username);
          this.isAuthenticatedSubject.next(true);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  }

  logout(): void {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('currentUser');
  }
} 