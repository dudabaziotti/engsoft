import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../shared/services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [CommonModule],
      providers: [AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have user$ observable', () => {
    expect(component.user$).toBeDefined();
  });

  it('should call authService.signInWithGoogle on signInWithGoogle', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'signInWithGoogle');
    component.signInWithGoogle();
    expect(authService.signInWithGoogle).toHaveBeenCalled();
  });

  it('should call authService.signOut on signOut', () => {
    const authService = TestBed.inject(AuthService);
    spyOn(authService, 'signOut');
    component.signOut();
    expect(authService.signOut).toHaveBeenCalled();
  });
});
