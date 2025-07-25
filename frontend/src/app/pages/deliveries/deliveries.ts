import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BeneficiariesService } from '../../services/beneficiaries.service';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { catchError, firstValueFrom, of } from 'rxjs';
import { DonationsService } from '../../services/donations.service';
import { deliveriesService } from '../../services/deliveries.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-deliveries',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  templateUrl: './deliveries.html',
  styleUrl: './deliveries.css'
})
export default class Deliveries implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  private _formBuilder = inject(FormBuilder);
  private beneficiarieService = inject(BeneficiariesService);
  private donationService = inject(DonationsService);
  private deliveriesService = inject(deliveriesService);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);

  isLoading = false;
  userRole: string = '';

  successMessage: string | null = null;
  errorMessage: string | null = null;

  searchCedulaBeneficiario: string = '';
  searchCedula: string = '';
  startDate: string = '';
  endDate: string = '';

  mostrarModal = false;
  beneficiarieExists = false;
  mostrarModalBeneficiarie = false;

  allDeliveries: any[] = [];
  deliveries: any[] = [];
  products: any[] = [];

  DeliverieForm!: FormGroup;

  form = this._formBuilder.group({
    nombres_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    cedula_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    direccion_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    telefono_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    id_donacion: this._formBuilder.nonNullable.control<number>(0, Validators.required)
  })

  formBeneficiarie = this._formBuilder.group({
    nombres_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    cedula_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    direccion_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    telefono_beneficiario: this._formBuilder.nonNullable.control('', Validators.required)
  });

  ngOnInit(): void {
    this.loadBeneficiariesWithDeliveries();
    this.loadAvailableProducts();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadAvailableProducts() {
    this.donationService.getDonations().subscribe({
      next: (donations) => {
        this.products = donations.filter(p => p.tipo_donacion === 'Producto' && p.disponible);
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.products = [];
      }
    });
  }

  loadBeneficiariesWithDeliveries() {
    this.isLoading = true;
    this.beneficiarieService.getBeneficiariesWithDeliveries().subscribe({
      next: (data) => {
        this.allDeliveries = data;
        this.deliveries = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar entregas:', error);
        this.isLoading = false;
      }
    });
  }

  async submit() {
    if (this.form.invalid) return;

    const {
      nombres_beneficiario,
      cedula_beneficiario,
      direccion_beneficiario,
      telefono_beneficiario,
      id_donacion
    } = this.form.getRawValue();

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      const beneficiario = await firstValueFrom(
        this.beneficiarieService.getBeneficiarieByCedula(cedula_beneficiario).pipe(
          catchError(() => of(null))
        )
      );

      if (!beneficiario) return;

      const beneficiario_id = beneficiario.id_beneficiario;

      await firstValueFrom(
        this.deliveriesService.registerDeliveries(beneficiario_id, id_donacion)
      );

      await firstValueFrom(
        this.donationService.updateDonationAvailability(false, id_donacion)
      );

      this.notification.showSuccess('Entrega registrada correctamente');
      this.loadBeneficiariesWithDeliveries();
      this.loadAvailableProducts();
      this.cerrarModal();
      this.form.reset();

    } catch (error) {
      this.notification.showError('Error al registrar la entrega');
      console.error('Error en registrar la entrega:', error);
    } finally {
      this.isLoading = false;
    }
  }

  submitBeneficiarie() {
    if (this.formBeneficiarie.invalid) return;

    const { nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario } = this.formBeneficiarie.getRawValue();
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.beneficiarieService.registerBeneficiaries(nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario).subscribe({
      next: (response) => {
        this.notification.showSuccess('Beneficiario registrado correctamente')
        this.cerrarModalBeneficiarie();
        this.formBeneficiarie.reset();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al registrar al beneficiario');
        console.error('Error al registrar al beneficiario:', error);
        this.isLoading = false;
      }
    })
  }

  deleteDeliverie(id_entrega: number) {
    if (!confirm('⚠️¿Seguro que quieres eliminar esta entrega?⚠️')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.deliveriesService.deleteDeliverie(id_entrega).subscribe({
      next: () => {
        this.successMessage = 'Entrega eliminado correctamente';
        this.loadBeneficiariesWithDeliveries();
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al eliminar la entrga';
        console.error('Error al eliminar la entrega:', error);
        this.isLoading = false;
      }
    })
  }

  /*   searchDeliverieByCedula() {
      const cedula = this.searchCedula.trim();
      if (!cedula) {
        this.deliveries = this.allDeliveries;
        return;
      }
  
      this.deliveries = this.allDeliveries.filter(d =>
        d.cedula_beneficiario.includes(cedula)
      );
    } */

  searchDeliverieByCedula() {
    const cedula = this.searchCedula.trim().toLowerCase();
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : new Date(); // si no hay fin y hay inicio, usamos hoy

    this.deliveries = this.allDeliveries.filter(d => {
      const matchesCedula = cedula ? d.cedula_beneficiario.toLowerCase().includes(cedula) : true;

      let matchesDate = true;

      if (start && !this.endDate) {
        const entregaDate = new Date(d.entrega.fecha_entrega);
        matchesDate = entregaDate >= start && entregaDate <= end;
      } else if (start && this.endDate) {
        const entregaDate = new Date(d.entrega.fecha_entrega);
        matchesDate = entregaDate >= start && entregaDate <= end;
      }

      return matchesCedula && matchesDate;
    });
  }

  clearSearch() {
    this.searchCedula = '';
    this.startDate = '';
    this.endDate = '';
    this.deliveries = this.allDeliveries;
  }

  async checkBeneficiario() {
    const cedula_beneficiario = this.searchCedulaBeneficiario;
    if (!cedula_beneficiario) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      const beneficiarie = await firstValueFrom(
        this.beneficiarieService.getBeneficiarieByCedula(cedula_beneficiario).pipe(
          catchError(() => of(null))
        )
      );

      if (beneficiarie) {
        this.beneficiarieExists = true;
        this.form.patchValue({
          nombres_beneficiario: beneficiarie.nombres_beneficiario,
          cedula_beneficiario: beneficiarie.cedula_beneficiario,
          direccion_beneficiario: beneficiarie.direccion_beneficiario,
          telefono_beneficiario: beneficiarie.telefono_beneficiario
        });
        this.successMessage = 'Donante encontrado';
        this.searchCedulaBeneficiario = ''; // Limpia el input de búsqueda
        setTimeout(() => {
          this.successMessage = null;
        }, 1000);
      } else {
        this.beneficiarieExists = false;
        this.errorMessage = 'Beneficiario no registrado';
        setTimeout(() => {
          this.errorMessage = null;
        }, 1000);
        this.form.patchValue({
          nombres_beneficiario: '',
          cedula_beneficiario: '',
          direccion_beneficiario: '',
          telefono_beneficiario: ''
        });
      }
    } catch (error) {
      this.errorMessage = 'Error al verificar beneficiario';
      console.error('Error checking beneficiarie:', error);
    } finally {
      this.isLoading = false;
    }
  }

  abrirModalBeneficiarie() {
    this.mostrarModalBeneficiarie = true;
  }

  cerrarModalBeneficiarie() {
    this.mostrarModalBeneficiarie = false;
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

}
