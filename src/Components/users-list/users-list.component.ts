import { Component, inject } from '@angular/core';
import { User } from '../../Models/user';
import { AuthService } from '../../Services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../Services/user.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [CommonModule,TableModule, RouterLink, MatIconModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent {
  users!: User[];
  router = inject(Router);
  
  constructor(private userService: UsersService, private authService: AuthService) {}

  ngOnInit() {
    this.userService.getUsers();
    this.userService.users$.subscribe(users => {
      this.users = users;
      console.log(this.users);
    });
  }

  getAuthServiceRole(): string {
    return this.authService.role;
  }

  updateUser(user: User) {
    this.router.navigate(['/update-user', user.id]);
  }

  showUserDetails(userId: number) {
    this.router.navigate(['/user-details', userId]);
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id);
    console.log("Deleted user");
  }
  add(){
    
  }
}