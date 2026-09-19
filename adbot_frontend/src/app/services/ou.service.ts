import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface OrganizationalUnit {
  name: string;
  distinguished_name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OuService {
  private ousSubject = new BehaviorSubject<OrganizationalUnit[]>([]);
  public ous$ = this.ousSubject.asObservable();

  constructor() {
    // Charger les données depuis localStorage au démarrage
    this.loadOusFromStorage();
  }

  private loadOusFromStorage() {
    const storedOus = localStorage.getItem('organizational_units');
    if (storedOus) {
      try {
        const ous = JSON.parse(storedOus);
        this.ousSubject.next(ous);
      } catch (error) {
        console.error('Error loading OUs from storage:', error);
      }
    }
  }

  private saveOusToStorage(ous: OrganizationalUnit[]) {
    localStorage.setItem('organizational_units', JSON.stringify(ous));
  }

  getOus(): Observable<OrganizationalUnit[]> {
    return this.ous$;
  }

  addOu(ou: OrganizationalUnit) {
    const currentOus = this.ousSubject.value;
    const newOus = [...currentOus, ou];
    this.ousSubject.next(newOus);
    this.saveOusToStorage(newOus);
  }

  updateOu(ou: OrganizationalUnit) {
    const currentOus = this.ousSubject.value;
    const updatedOus = currentOus.map(o => 
      o.distinguished_name === ou.distinguished_name ? ou : o
    );
    this.ousSubject.next(updatedOus);
    this.saveOusToStorage(updatedOus);
  }

  deleteOu(distinguishedName: string) {
    const currentOus = this.ousSubject.value;
    const filteredOus = currentOus.filter(o => o.distinguished_name !== distinguishedName);
    this.ousSubject.next(filteredOus);
    this.saveOusToStorage(filteredOus);
  }

  // Méthode pour charger depuis l'API (à implémenter plus tard)
  loadOusFromApi() {
    // TODO: Appel API pour charger les OUs depuis le backend
    // this.http.get<OrganizationalUnit[]>('/api/organizational-units')
    //   .subscribe(ous => {
    //     this.ousSubject.next(ous);
    //     this.saveOusToStorage(ous);
    //   });
  }
} 