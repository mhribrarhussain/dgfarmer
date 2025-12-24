import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    email = '';
    password = '';
    error = '';
    isLoading = false;

    onSubmit() {
        this.error = '';
        this.isLoading = true;

        setTimeout(() => {
            const success = this.authService.login(this.email, this.password);
            this.isLoading = false;

            if (success) {
                const user = this.authService.getCurrentUser();
                if (user?.role === 'farmer') {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/']);
                }
            } else {
                this.error = 'Invalid email or password. Please register first if you don\'t have an account.';
            }
        }, 500);
    }
}
