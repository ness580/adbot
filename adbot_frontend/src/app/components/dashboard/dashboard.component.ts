import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ThemeService, Theme } from '../../services/theme.service';

interface DashboardStats {
  totalUsers: number;
  activeGroups: number;
  computers: number;
  organizationalUnits: number;
  enabledUsers: number;
  disabledUsers: number;
}

interface ActivityItem {
  type: 'success' | 'warning' | 'danger' | 'info';
  description: string;
  user: string;
  time: string;
}

interface QuickAction {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalUsers: 0,
    activeGroups: 0,
    computers: 0,
    organizationalUnits: 0,
    enabledUsers: 0,
    disabledUsers: 0
  };

  loading: boolean = true;
  currentTheme: Theme = 'light';

  recentActivity: ActivityItem[] = [
    {
      type: 'info',
      description: 'Dashboard loaded with real data',
      user: 'System',
      time: 'Just now'
    }
  ];

  quickActions: QuickAction[] = [
    {
      title: 'Create New User',
      description: 'Add a new Active Directory account',
      icon: 'pi pi-user-plus',
      route: '/users'
    },
    {
      title: 'Manage Groups',
      description: 'Create or modify security groups',
      icon: 'pi pi-users',
      route: '/groups'
    },
    {
      title: 'Manage Computers',
      description: 'View and manage domain computers',
      icon: 'pi pi-desktop',
      route: '/computers'
    },
    {
      title: 'Organizational Units',
      description: 'Manage OU structure',
      icon: 'pi pi-sitemap',
      route: '/ous'
    }
  ];

  constructor(
    private http: HttpClient,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  loadDashboardData() {
    this.loading = true;
    
    // Load users count
    this.http.get('/api/users', { params: { limit: 1 } }).subscribe({
      next: (response: any) => {
        this.stats.totalUsers = response.count || 0;
        this.loadGroupsCount();
      },
      error: (error) => {
        console.error('Error loading users count:', error);
        this.loadGroupsCount();
      }
    });
  }

  loadGroupsCount() {
    this.http.get('/api/groups', { params: { limit: 1 } }).subscribe({
      next: (response: any) => {
        this.stats.activeGroups = response.count || 0;
        this.loadComputersCount();
      },
      error: (error) => {
        console.error('Error loading groups count:', error);
        this.loadComputersCount();
      }
    });
  }

  loadComputersCount() {
    this.http.get('/api/computers', { params: { limit: 1 } }).subscribe({
      next: (response: any) => {
        this.stats.computers = response.count || 0;
        this.loadOrganizationalUnitsCount();
      },
      error: (error) => {
        console.error('Error loading computers count:', error);
        this.loadOrganizationalUnitsCount();
      }
    });
  }

  loadOrganizationalUnitsCount() {
    this.http.get('/api/organizational-units', { params: { limit: 1 } }).subscribe({
      next: (response: any) => {
        this.stats.organizationalUnits = response.count || 0;
        this.loadUserStatusStats();
      },
      error: (error) => {
        console.error('Error loading OUs count:', error);
        this.loadUserStatusStats();
      }
    });
  }

  loadUserStatusStats() {
    // Load enabled users count
    this.http.get('/api/users', { params: { limit: 1000, enabled: true } }).subscribe({
      next: (response: any) => {
        this.stats.enabledUsers = response.users?.length || 0;
        
        // Load disabled users count
        this.http.get('/api/users', { params: { limit: 1000, enabled: false } }).subscribe({
          next: (disabledResponse: any) => {
            this.stats.disabledUsers = disabledResponse.users?.length || 0;
            this.loading = false;
            this.updateActivityLog();
          },
          error: (error) => {
            console.error('Error loading disabled users:', error);
            this.loading = false;
            this.updateActivityLog();
          }
        });
      },
      error: (error) => {
        console.error('Error loading enabled users:', error);
        this.loading = false;
        this.updateActivityLog();
      }
    });
  }

  updateActivityLog() {
    this.recentActivity = [
      {
        type: 'success',
        description: `Loaded ${this.stats.totalUsers} users, ${this.stats.activeGroups} groups, ${this.stats.computers} computers`,
        user: 'System',
        time: 'Just now'
      },
      {
        type: 'info',
        description: `${this.stats.enabledUsers} enabled users, ${this.stats.disabledUsers} disabled users`,
        user: 'System',
        time: 'Just now'
      }
    ];
  }

  getStatusColor(type: string): string {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }

  getStatusIcon(type: string): string {
    switch (type) {
      case 'success': return 'pi pi-check-circle';
      case 'warning': return 'pi pi-exclamation-triangle';
      case 'danger': return 'pi pi-times-circle';
      case 'info': return 'pi pi-info-circle';
      default: return 'pi pi-circle';
    }
  }
}
