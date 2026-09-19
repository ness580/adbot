import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

// PrimeNG Components
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';

// User Model
interface User {
  Name: string;
  SamAccountName: string;
  Enabled: boolean;
  LastLogonDate: string;
  Description: string;
  Department: string;
  EmailAddress?: string;
  Title?: string;
  OfficePhone?: string;
  Manager?: string;
  DistinguishedName?: string;
  Created?: string;
  Modified?: string;
  PasswordLastSet?: string;
  AccountExpirationDate?: string;
  LockedOut?: boolean;
  PasswordExpired?: boolean;
  PasswordNeverExpires?: boolean;
  MemberOf?: string[];
  password?: string; // Ajouté pour l'ajout utilisateur
  ou?: string; // Ajouté pour l'ajout utilisateur
}

interface UsersResponse {
  users: User[];
  count: number;
  status: string;
  filters_applied?: any;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  
  // Search and Filter
  searchTerm: string = '';
  enabledFilter: boolean | null = null;
  
  // Pagination
  first: number = 0;
  rows: number = 10;
  
  // Selected user for actions
  selectedUser: User | null = null;
  
  // Dialog visibility
  showUserDetailDialog: boolean = false;
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  
  // Status options for filter
  statusOptions = [
    { label: 'All Users', value: null },
    { label: 'Enabled Only', value: true },
    { label: 'Disabled Only', value: false }
  ];

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    
    // Build query parameters
    let params: any = { limit: this.rows };
    if (this.searchTerm) {
      params.search = this.searchTerm;
    }
    if (this.enabledFilter !== null) {
      params.enabled = this.enabledFilter;
    }

    this.http.get<UsersResponse>('/api/users', { params })
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.filteredUsers = [...this.users];
          this.totalRecords = response.count;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load users'
          });
          this.loading = false;
        }
      });
  }

  onSearch() {
    this.loadUsers();
  }

  onFilterChange() {
    this.loadUsers();
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.loadUsers();
  }

  toggleUserStatus(user: User) {
    const newStatus = !user.Enabled;
    const action = newStatus ? 'enable' : 'disable';
    
    this.confirmationService.confirm({
      message: `Are you sure you want to ${action} user "${user.Name}"?`,
      header: 'Confirm Action',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateUserStatus(user, newStatus);
      }
    });
  }

  updateUserStatus(user: User, enabled: boolean) {
    this.http.put(`/api/users/${user.SamAccountName}`, { enabled })
      .subscribe({
        next: (response: any) => {
          user.Enabled = enabled;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `User ${enabled ? 'enabled' : 'disabled'} successfully`
          });
        },
        error: (error) => {
          console.error('Error updating user status:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to ${enabled ? 'enable' : 'disable'} user`
          });
        }
      });
  }

  viewUserDetails(user: User) {
    this.selectedUser = user;
    this.isEditMode = false;
    this.showUserDetailDialog = true;
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditMode = true;
    this.isAddMode = false; // S'assurer que ce n'est pas en mode ajout
    this.showUserDetailDialog = true;
  }

  saveUserEdits() {
    if (!this.selectedUser) return;
    // Mapping des champs pour correspondre au backend
    const userToUpdate: any = {
      name: this.selectedUser.Name,
      email: this.selectedUser.EmailAddress,
      department: this.selectedUser.Department,
      title: this.selectedUser.Title,
      phone: this.selectedUser.OfficePhone,
      manager: this.selectedUser.Manager,
      description: this.selectedUser.Description,
      enabled: this.selectedUser.Enabled,
    };
    if (this.selectedUser.password) {
      userToUpdate.password = this.selectedUser.password;
    }
    console.log('Payload envoyé au backend:', userToUpdate);
    this.http.put(`/api/users/${this.selectedUser.SamAccountName}`, userToUpdate)
      .subscribe({
        next: (response: any) => {
          console.log('Réponse backend modification utilisateur:', response);
          alert('Utilisateur modifié avec succès !');
          this.isEditMode = false;
          this.showUserDetailDialog = false;
          this.loadUsers();
        },
        error: (error) => {
          alert('Erreur lors de la modification !');
        }
      });
  }

  deleteUser(user: User) {
    if (!window.confirm(`Voulez-vous vraiment supprimer l'utilisateur "${user.Name}" ?`)) return;
    this.http.delete(`/api/users/${user.SamAccountName}`)
      .subscribe({
        next: () => {
          this.users = this.users.filter(u => u.SamAccountName !== user.SamAccountName);
          this.filteredUsers = this.filteredUsers.filter(u => u.SamAccountName !== user.SamAccountName);
          this.totalRecords--;
        },
        error: () => {
          alert("Erreur lors de la suppression !");
        }
      });
  }

  resetPassword(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to reset password for user "${user.Name}"?`,
      header: 'Confirm Password Reset',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // This would typically open a dialog to enter new password
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Password reset functionality to be implemented'
        });
      }
    });
  }

  openAddUserForm() {
    console.log('openAddUserForm() appelée');
    this.selectedUser = {
      Name: '',
      SamAccountName: '',
      Enabled: true,
      LastLogonDate: '',
      Description: '',
      Department: '',
      EmailAddress: '',
      Title: '',
      OfficePhone: '',
      Manager: '',
      password: '', // Ajouté pour l'ajout utilisateur
      ou: '' // Ajouté pour l'ajout utilisateur
    };
    this.isAddMode = true;
    this.isEditMode = true;
    this.showUserDetailDialog = true; // Ouvrir la modale
    console.log('showUserDetailDialog:', this.showUserDetailDialog);
    console.log('isAddMode:', this.isAddMode);
    console.log('isEditMode:', this.isEditMode);
  }

  addUser() {
    if (!this.selectedUser) return;
    const userToSend = {
      name: this.selectedUser.Name,
      samaccountname: this.selectedUser.SamAccountName,
      password: this.selectedUser.password,
      enabled: this.selectedUser.Enabled,
      description: this.selectedUser.Description,
      email: this.selectedUser.EmailAddress,
      department: this.selectedUser.Department,
      title: this.selectedUser.Title,
      phone: this.selectedUser.OfficePhone,
      manager: this.selectedUser.Manager,
      ou: this.selectedUser.ou
    };
    console.log('Objet envoyé au backend:', userToSend);
    this.http.post('/api/users', userToSend)
      .subscribe({
        next: (response: any) => {
          console.log('Réponse backend ajout utilisateur:', response);
          alert('Utilisateur ajouté avec succès !');
          this.isAddMode = false;
          this.isEditMode = false;
          this.selectedUser = null;
          this.loadUsers();
        },
        error: (error) => {
          alert('Erreur lors de l\'ajout !');
        }
      });
  }

  cancelEdit() {
    this.isEditMode = false;
    this.showUserDetailDialog = false;
    this.selectedUser = null;
  }

  getStatusSeverity(enabled: boolean): string {
    return enabled ? 'success' : 'danger';
  }

  getStatusIcon(enabled: boolean): string {
    return enabled ? 'pi pi-check-circle' : 'pi pi-times-circle';
  }

  formatDate(dateString: string): string {
    if (!dateString || dateString === 'Never') {
      return 'Never';
    }
    return new Date(dateString).toLocaleDateString();
  }
}
