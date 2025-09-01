import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faChildren,
  faIdCard,
  faBook,
  faHeart,
  faChalkboardUser,
  faHeartCirclePlus,
  faUserPlus,
  faBoxArchive,
  faPlus,
  faDollarSign,
  faWarehouse,
  faReceipt,
  faCashRegister,
  faCartShopping,
  faUserShield,
  faFileInvoice,
  faSquare,
  faUserGroup,
  faBars,
  faHouse,
  faUsers,
  faTerminal,
  faPrint,
  faBoxesStacked,
  faB
} from '@fortawesome/free-solid-svg-icons';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { sequenceEqual } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header{
  // Iconos
  faIdCard = faIdCard;
  faHeart = faHeart;
  faHeartCirclePlus = faHeartCirclePlus;
  faUserPlus = faUserPlus;
  faBoxArchive = faBoxArchive;
  faPlus = faPlus;
  faCartShopping = faCartShopping;
  faWarehouse = faWarehouse;
  faReceipt = faReceipt;
  faCashRegister = faCashRegister
  faFileInvoice = faFileInvoice;
  faDollarSign = faDollarSign;
  faUserShield = faUserShield;
  faSquare = faSquare;
  faUserGroup = faUserGroup;
  faTerminal = faTerminal;
  faBars = faBars;
  faHouse = faHouse;
  faUsers = faUsers;
  faBoxesStacked = faBoxesStacked;
  faPrint = faPrint;
  faBook = faBook;
  faChalkboardUser = faChalkboardUser;
  faChildren = faChildren;

  usuario: string = '';
  rol: string = '';
  iniciales: string = '';

  private router = inject(Router);
  private authStateService = inject(AuthStateService);

  constructor(private authState: AuthStateService) {
    const session = this.authState.getSession();
    if (session) {
      this.usuario = session.usuario;
      this.rol = session.rol;
      this.iniciales = this.obtenerIniciales(session.usuario);
    }
  }

  obtenerIniciales(nombre: string): string {
    const palabras = nombre.trim().split(' ');
    if (palabras.length === 1) return palabras[0].substring(0, 2).toUpperCase();
    return (palabras[0][0] + palabras[1][0]).toUpperCase();
  }

  isDonacionesOpen = false;
  isBeneficiariesOpen = false;
  isInventarioOpen = false;
  isCoursesOpen = false;
  isMenuOpen = signal(false);

  toggleSubmenu(menu: string) {
    if (menu === 'donaciones') {
      this.isDonacionesOpen = !this.isDonacionesOpen;
    } else if (menu === 'inventario') {
      this.isInventarioOpen = !this.isInventarioOpen;
    } else if (menu === 'beneficiarios') {
      this.isBeneficiariesOpen = !this.isBeneficiariesOpen;
    } else if (menu === 'cursos'){
      this.isCoursesOpen = !this.isCoursesOpen;
    }
  }

  toggleMenu() {
    requestAnimationFrame(() => {
      this.isMenuOpen.update(prev => !prev);
    });
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  logout() {
    this.authState.signOut();
    this.router.navigate(['/auth/log-in']);
  }
}
