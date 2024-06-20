import { Component, OnInit } from '@angular/core';
import { AuthService } from '../servicios/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  listUsers: any[] = [];
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.verUsuarios().subscribe((res: any) => {
      res.data
      this.listUsers = res.data;
      console.log('Lista de usuarios', this.listUsers);

     
    });
  }

  onSubmit(): void {
    if (!this.authService.login(this.username, this.password)) {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
