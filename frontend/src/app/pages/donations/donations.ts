import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DonorsService } from '../../services/donors.service';
import { DonationsService } from '../../services/donations.service';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faTicket,
  faRupiahSign
} from '@fortawesome/free-solid-svg-icons';
import { catchError, filter, firstValueFrom, of } from 'rxjs';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';


@Component({
  selector: 'app-donations',
  imports: [ReactiveFormsModule, CommonModule, FontAwesomeModule, FormsModule],
  templateUrl: './donations.html',
  styleUrl: './donations.css'
})
export default class Donations implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faTicket = faTicket;

  constructor(private cdr: ChangeDetectorRef) { }
  private _formBuilder = inject(FormBuilder);
  private donationsService = inject(DonationsService);
  private donorService = inject(DonorsService);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);

  userRole: string = '';
  searchType = '';
  isLoading = false;

  errorMessage: string | null = null;
  successMessage: string | null = null;

  searchCedulaDonante: string = '';
  searchCedula: string = '';
  startDate: string = '';
  endDate: string = '';

  mostrarModal = false;
  mostrarModalDonor = false;
  donorExists = false;

  allDonations: any[] = [];
  donations: any[] = [];
  donors: any[] = [];

  DonationsForm!: FormGroup;

  form = this._formBuilder.group({
    nombres: this._formBuilder.nonNullable.control('', Validators.required),
    numero_identificacion: this._formBuilder.nonNullable.control('', Validators.required),
    telefono: this._formBuilder.nonNullable.control('', Validators.required),
    tipo_donacion: this._formBuilder.nonNullable.control('', Validators.required),
    valor_estimado: this._formBuilder.control<number | null>(null),
    metodo_pago: this._formBuilder.nonNullable.control(''),
    detalle_donacion: this._formBuilder.nonNullable.control(''),
    url_image: this._formBuilder.control(''),
    disponible: this._formBuilder.nonNullable.control(true)
  });

  formDonor = this._formBuilder.group({
    nombres: this._formBuilder.nonNullable.control('', Validators.required),
    numero_identificacion: this._formBuilder.nonNullable.control('', Validators.required),
    telefono: this._formBuilder.nonNullable.control('', Validators.required)
  });

  ngOnInit(): void {
    this.loadDonations();
    const session = this.authStateService.getSession();
    this.userRole = session ? session?.rol : '';

    // se escuchan cambios en tipo_donacion y ajusta los campos relacionados
    this.form.get('tipo_donacion')!.valueChanges.subscribe(tipo => {
      if (tipo === 'Monetaria') {
        this.form.get('valor_estimado')!.setValidators([Validators.required]);
        this.form.get('valor_estimado')!.enable();

        this.form.get('metodo_pago')!.setValidators([Validators.required]);
        this.form.get('metodo_pago')!.enable();

        this.form.get('detalle_donacion')!.clearValidators();
        this.form.get('detalle_donacion')!.disable();
      } else if (tipo === 'Producto') {
        this.form.get('valor_estimado')!.clearValidators();
        this.form.get('valor_estimado')!.disable();

        this.form.get('metodo_pago')!.clearValidators();
        this.form.get('metodo_pago')!.disable();

        this.form.get('detalle_donacion')!.setValidators([Validators.required]);
        this.form.get('detalle_donacion')!.enable();
      } else {
        // Si no es ni monetaria ni producto, deshabilita todo lo condicional
        this.form.get('valor_estimado')!.disable();
        this.form.get('metodo_pago')!.disable();
        this.form.get('detalle_donacion')!.disable();
      }
      // Actualiza validaciones
      this.form.get('valor_estimado')!.updateValueAndValidity();
      this.form.get('metodo_pago')!.updateValueAndValidity();
      this.form.get('detalle_donacion')!.updateValueAndValidity();
      this.cdr.detectChanges(); // Fuerza la sincronización de la vista
    });

  }

  loadDonations() {
    this.isLoading = true;
    this.errorMessage = null;

    this.donationsService.getDonationsWithDonors().subscribe({
      next: (data) => {
        this.allDonations = data;
        this.donations = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los donadores. Intente nuevamente.';
        console.error('Error al cargar donadores:', error);
        this.isLoading = false;
      }
    });
  }

  submitDonor() {
    if (this.formDonor.invalid) return;

    const { nombres, numero_identificacion, telefono } = this.formDonor.getRawValue();
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.donorService.createDonor(nombres, numero_identificacion, telefono).subscribe({
      next: (response) => {
        this.notification.showSuccess('Donador registrado correctamente');
        this.cerrarModalDonor();
        this.formDonor.reset();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al registrar donador')
        console.error('Error al registrar donador:', error);
        this.isLoading = false;
      }
    });
  }

  async submit() {
    if (this.form.invalid) return;

    const tipo_donacion = this.form.value.tipo_donacion!;
    const isMonetaria = tipo_donacion === 'Monetaria';

    if (isMonetaria && (!this.form.value.valor_estimado || this.form.value.valor_estimado <= 0)) {
      this.notification.showError('Debe ingresar un monto válido');
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      const numero_identificacion = this.form.value.numero_identificacion!;
      const existingDonor = await firstValueFrom(
        this.donorService.getDonorByCedula(numero_identificacion).pipe(catchError(() => of(null)))
      );

      const donorId = existingDonor.id_donante;
      const valor_estimado: number = isMonetaria ? this.form.value.valor_estimado ?? 0 : 0;
      const detalle_donacion: string = isMonetaria ? '' : this.form.value.detalle_donacion ?? '';
      const metodo_pago: string = this.form.value.metodo_pago!;
      const url_image: string = this.form.value.url_image ?? '';
      const disponible: boolean = true;

      await firstValueFrom(
        this.donationsService.createDonations(
          donorId,
          tipo_donacion,
          valor_estimado,
          metodo_pago,
          detalle_donacion,
          url_image,
          disponible
        )
      );

      this.notification.showSuccess('Donación registrada correctamente');
      await this.loadDonations();
      this.cerrarModal();

    } catch (error: any) {
      this.notification.showError('Error al registrar la donación');
      console.error('Error al registar donación:', error);
    } finally {
      this.isLoading = false;
    }

  }

  deleteDonation(id_donacion: number) {
    if (!confirm('⚠️¿Seguro que quieres eliminar esta donacion?⚠️')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.donationsService.deleteDonation(id_donacion).subscribe({
      next: () => {
        this.notification.showSuccess('Donación eliminada correctamente');
        this.loadDonations();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al eliminar la donación');
        console.error('Error al eliminar donación:', error);
        this.isLoading = false;
      }
    });
  }

  async checkDonor() {
    const numero_identificacion = this.searchCedulaDonante;
    if (!numero_identificacion) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try {
      const donor = await firstValueFrom(
        this.donorService.getDonorByCedula(numero_identificacion).pipe(
          catchError(() => of(null))
        )
      );

      if (donor) {
        this.donorExists = true;
        this.form.patchValue({
          nombres: donor.nombres,
          numero_identificacion: donor.numero_identificacion,
          telefono: donor.telefono
        });
        this.successMessage = 'Donante encontrado';
        setTimeout(() => {
          this.successMessage = null;
        }, 1000);
        this.searchCedulaDonante = '';
      } else {
        this.donorExists = false;
        this.errorMessage = 'Donante no registrado';
        setTimeout(() => {
          this.errorMessage = null;
        }, 1000);
        this.searchCedulaDonante = '';
        this.form.patchValue({
          nombres: '',
          numero_identificacion: '',
          telefono: ''
        });
      }
    } catch (error) {
      this.errorMessage = 'Error al verificar donante';
      console.error('Error al verificar donante:', error);
    } finally {
      this.isLoading = false;
    }
  }

  searchDonationsByCedula() {
    const cedula = this.searchCedula.trim().toLowerCase();
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : new Date();

    const filtered = this.allDonations.filter(donation => {
      const matchesCedula = cedula ? donation.donante.numero_identificacion.toLowerCase().includes(cedula) : true;
      const donationDate = new Date(donation.fecha_donacion);
      let matchesDate = true;

      if (start && !this.endDate) {

        matchesDate = donationDate >= start && donationDate <= end;
      } else if (start && this.endDate) {
        matchesDate = donationDate >= start && donationDate <= end;
      }

      return matchesCedula && matchesDate;
    });

    if (filtered.length === 0) {
      this.notification.showError('No se encontraron donaciones con esos criterios.');
    } else {
      this.donations = filtered;
    }
  }

  clearSearch() {
    this.searchCedula = '';
    this.startDate = '';
    this.endDate = '';
    this.donations = this.allDonations;
  }

  abrirModal() {
    this.mostrarModal = true;
    this.form.reset({
      tipo_donacion: '',
      valor_estimado: null,
      detalle_donacion: '',
      metodo_pago: ''
    });
    this.donorExists = false;
    this.errorMessage = null;
    this.successMessage = null;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  abrirModalDonor() {
    this.mostrarModalDonor = true;
  }

  cerrarModalDonor() {
    this.mostrarModalDonor = false;
  }

  get showMonetaryFields(): boolean {
    return this.form.value.tipo_donacion === 'Monetaria';
  }

  get showProductFields(): boolean {
    return this.form.value.tipo_donacion === 'Producto';
  }
}
