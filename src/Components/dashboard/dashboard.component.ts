import { Component } from '@angular/core';
import { UserActivityGraphComponent } from '../user-activity-graph/user-activity-graph.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ UserActivityGraphComponent,
    
    MatCardModule,
    MatListModule,
    MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
