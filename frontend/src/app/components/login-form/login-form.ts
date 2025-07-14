import {Component, OnInit} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from '@angular/material/button';
import {Credentials} from '../../models/Credentials';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../services/auth-service';
import {Router} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  imports: [
    MatFormFieldModule,
    MatInput,
    MatButton,
    FormsModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginForm implements OnInit {
  credentials!: Credentials;
  loginError?: string;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.resetCredentials();
  }

  /**
   * resets login-form to empty strings
   */
  resetCredentials(): void {
    this.credentials = new Credentials('', '');
  }

  /**
   * handles login-operations by calling AuthService
   */
  performLogin(): void{
    this.authService.login(this.credentials).subscribe((response: HttpResponse<void|string>): void => {
        if (response.status === 200){ // if response status is 200, assume login was successful
          this.resetCredentials();
          this.enterApplication();
        }else{
          this.showLoginError(response.body as string);
        }
      },
      (error: HttpErrorResponse): void => {
        this.showLoginError(error.error as string);
      }
    );
  }

  showLoginError(message: string): void {
    this.snackBar.open(message, undefined, {duration: 2000});
  }

  /**
   * redirects to the landing page
   */
  enterApplication(): void{
    console.log('login successful');
    void this.router.navigate(['']);
  }
}
