import {Component, OnInit} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconModule} from '@angular/material/icon';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {User} from '../../models/User';
import {AuthService} from '../../services/auth-service';
import {UserService} from '../../services/user-service';

@Component({
  selector: 'app-menu-bar',
  imports: [
    MatToolbar,
    MatIconModule,
    MatButton,
    RouterLink,
    RouterLinkActive,
    MatIconButton
  ],
  templateUrl: './menu-bar.html',
  styleUrl: './menu-bar.scss'
})
export class MenuBar implements OnInit {
    user?: User;

    constructor(private authService: AuthService, private router: Router, private userService: UserService) {
    }

    ngOnInit(): void {
      this.fetchUser();
    }

   /*
    This array holds the definition of the menu's buttons.
   */
    buttons: {title: string, routerLink: string[]}[] = [
      {title: 'Welcome', routerLink: ['']}, // the tile is the text on the button, the routerLink specifies, where it will navigate
      {title: 'Example', routerLink: ['example']},
    ];

    /**
     * handles logout via AuthService and navigates back to login-page
     */
    handleLogout(): void {
      this.authService.logout().subscribe(() => {
        void this.router.navigate(['login']);
      })
    }

    /**
     * fetches information about logged-in user
     */
    fetchUser(): void{
      this.userService.getOwnUser().subscribe((user: User): void => {
        this.user = user;
      });
    }
}
