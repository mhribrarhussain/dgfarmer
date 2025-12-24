import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent {
    private authService = inject(AuthService);
    private router = inject(Router);

    name = '';
    email = '';
    password = '';
    role: 'farmer' | 'buyer' = 'buyer';
    error = '';
    isLoading = false;

    onSubmit() {
        this.error = '';
        this.isLoading = true;

        setTimeout(() => {
            const success = this.authService.register(this.name, this.email, this.password, this.role);
            this.isLoading = false;

            if (success) {
                if (this.role === 'farmer') {
                    this.router.navigate(['/dashboard']);
                } else {
                    this.router.navigate(['/']);
                }
            } else {
                this.error = 'An account with this email already exists.';
            }
        }, 500);
    }
}
