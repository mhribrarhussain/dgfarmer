import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './about.component.html',
    styleUrl: './about.component.scss'
})
export class AboutComponent {
    contactForm = {
        name: '',
        email: '',
        message: ''
    };

    submitted = false;

    team = [
        { name: 'Ahmed Khan', role: 'Founder & CEO', avatar: '👨‍💼' },
        { name: 'Fatima Ali', role: 'Head of Operations', avatar: '👩‍💼' },
        { name: 'Muhammad Aslam', role: 'Farmer Relations', avatar: '👨‍🌾' },
        { name: 'Sara Ahmed', role: 'Customer Success', avatar: '👩‍💻' }
    ];

    onSubmit() {
        // Mock form submission
        this.submitted = true;
        setTimeout(() => {
            this.submitted = false;
            this.contactForm = { name: '', email: '', message: '' };
        }, 3000);
    }
}
