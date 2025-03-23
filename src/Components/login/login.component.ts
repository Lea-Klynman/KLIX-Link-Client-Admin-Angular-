import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { partOfUser } from '../../Models/user';
import { AuthService } from '../../Services/auth.service';
import {  FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Roles } from '../../Models/roles';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatCardModule
    ,MatFormFieldModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router = inject(Router);
  logInForm!: FormGroup;
  email: string = '';
  password: string = '';
  user:partOfUser={};
  @Output() formClose = new EventEmitter<void>();
  @Input() showForm = false;

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit():void {
    this.logInForm = this.fb.group({
      email: ['',Validators.email],
      password: ['',Validators.required]
    });
  }
    
  onSubmit():void {
    if(this.logInForm?.valid)
    {
      this.user=this.logInForm.value;
      this.user.roles=[Roles.Admin];
      if(this.user)
      {
        this.authService.login(this.user).subscribe({
          next: (res) => {
            this.authService.saveToken(res.token,res.user);
            this.authService.isAuth=true;
            this.authService.role=res.role;
            this.authService.userId = res.userId;
            alert('Login successful!');
            this.router.navigate(['/']);
          },
          error: (err) => alert('Login failed: ' + err.error.message)
        });
        this.logInForm?.reset();
        this.formClose.emit();
      }
    }   
  }
}