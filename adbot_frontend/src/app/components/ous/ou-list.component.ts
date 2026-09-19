import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OuService, OrganizationalUnit } from '../../services/ou.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ou-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ou-list.component.html',
  styleUrl: './ou-list.component.scss'
})
export class OuListComponent implements OnInit, OnDestroy {
  ous: OrganizationalUnit[] = [];
  selectedOu: OrganizationalUnit | null = null;
  showOuDetailDialog = false;
  isAddMode = false;
  private subscription: Subscription = new Subscription();

  constructor(private ouService: OuService) {}

  ngOnInit() {
    // S'abonner aux changements des OUs
    this.subscription.add(
      this.ouService.getOus().subscribe(ous => {
        this.ous = ous;
      })
    );
  }

  ngOnDestroy() {
    // Se désabonner pour éviter les fuites mémoire
    this.subscription.unsubscribe();
  }

  openAddOuForm() {
    this.selectedOu = { name: '', distinguished_name: '', description: '' };
    this.isAddMode = true;
    this.showOuDetailDialog = true;
  }

  editOu(ou: OrganizationalUnit) {
    this.selectedOu = { ...ou };
    this.isAddMode = false;
    this.showOuDetailDialog = true;
  }

  addOu() {
    if (!this.selectedOu) return;
    this.ouService.addOu({ ...this.selectedOu });
    this.cancelEdit();
  }

  saveOuEdits() {
    if (!this.selectedOu) return;
    this.ouService.updateOu({ ...this.selectedOu });
    this.cancelEdit();
  }

  deleteOu(ou: OrganizationalUnit) {
    if (confirm(`Are you sure you want to delete the OU "${ou.name}"?`)) {
      this.ouService.deleteOu(ou.distinguished_name);
    }
  }

  cancelEdit() {
    this.showOuDetailDialog = false;
    this.selectedOu = null;
    this.isAddMode = false;
  }
} 