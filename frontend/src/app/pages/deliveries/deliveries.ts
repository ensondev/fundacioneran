import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BeneficiariesService } from '../../services/beneficiaries.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Observable, startWith, map } from 'rxjs';
import { FormControl } from '@angular/forms';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule, MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule],
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
  selectedDeliverie: any = null;

  searchCedulaBeneficiario: string = '';
  searchCedula: string = '';
  startDate: string = '';
  endDate: string = '';

  mostrarModal = false;
  beneficiarieExists = false;
  mostrarModalBeneficiarie = false;
  mostrarEditModal = false;

  allDeliveries: any[] = [];
  deliveries: any[] = [];
  products: any[] = [];

  productControl = new FormControl(''); // para autocomplete manual
  filteredProducts$: Observable<any[]> = of([]);

  DeliverieForm!: FormGroup;

  form = this._formBuilder.group({
    beneficiario_id: this._formBuilder.nonNullable.control<number | null>(null, Validators.required),
    nombres_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    cedula_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    direccion_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    telefono_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    id_donacion: this._formBuilder.nonNullable.control<number | null>(null, Validators.required)
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

    const { cedula_beneficiario, id_donacion } = this.form.getRawValue();

    if (!id_donacion) {
      this.notification.showError('Debe seleccionar un producto a entregar');
      return;
    }

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
    });
  }

  /* updateDeliverie() {
    const updatedData = {
      beneficiario_id: this.selectedDeliverie.entrega.id_beneficiario,
      donacion_id: Number(this.form.value.id_donacion),
      id_entrega: this.selectedDeliverie.entrega.id_entrega
    };

    console.log(updatedData)

    this.isLoading = true;

    firstValueFrom(this.deliveriesService.updateDeliverie(
      updatedData.beneficiario_id,
      updatedData.donacion_id,
      updatedData.id_entrega
    )).then(res => {
      if (res?.p_status) {
        this.notification.showSuccess('Entrega actualizada correctamente');
        this.cerrarEditModal();
        this.loadBeneficiariesWithDeliveries();
      } else {
        this.notification.showError('No se pudo actualizar la entrega');
      }
    }).catch(err => {
      this.notification.showError('Error al actualizar la entrega');
      console.error('Error en updateDeliverie:', err);
    }).finally(() => {
      this.isLoading = false;
    });

  } */

  updateDeliverie() {
    const updatedData = {
      beneficiario_id: Number(this.form.value.beneficiario_id),
      donacion_id: Number(this.form.value.id_donacion),
      id_entrega: this.selectedDeliverie.entrega.id_entrega
    };

    console.log('Datos a actualizar:', updatedData);

    this.isLoading = true;

    firstValueFrom(this.deliveriesService.updateDeliverie(
      updatedData.beneficiario_id,
      updatedData.donacion_id,
      updatedData.id_entrega
    ))
      .then(res => {
        if (res?.p_status) {
          this.notification.showSuccess('Entrega actualizada correctamente');
          this.cerrarEditModal();
          this.loadBeneficiariesWithDeliveries();
        } else {
          this.notification.showError('No se pudo actualizar la entrega');
        }
      })
      .catch(err => {
        this.notification.showError('Error al actualizar la entrega');
        console.error('Error en updateDeliverie:', err);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }



  /* deleteDeliverie(id_entrega: number) {
    if (!confirm('⚠️¿Seguro que quieres eliminar esta entrega?⚠️')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    try{
      const donacion = await firstValueFrom(
        this.donationService.getDonationsWithDonors().pipe(
          catchError(() => of(null))
        )
      );

      if(!donacion) return;

      const donacion_id = donacion.donationsWithDonor;
    }

    this.deliveriesService.deleteDeliverie(id_entrega).subscribe({
      next: (res) => {
        this.donationService.updateDonationAvailability().subscribe({

        })
        this.notification.showSuccess('Entrega eliminado correctamente')
        this.loadBeneficiariesWithDeliveries();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al eliminar la entrga');
        console.error('Error al eliminar la entrega:', error);
        this.isLoading = false;
      }
    });
  } */

  async deleteDeliverie(id_entrega: number) {
    if (!confirm('⚠️¿Seguro que quieres eliminar esta entrega?⚠️')) return;
    this.isLoading = true;

    try {
      // Obtener la entrega con su id_donacion asociado
      const id_donacion = await firstValueFrom(
        this.deliveriesService.getDeliverieById(id_entrega).pipe(
          catchError(() => of(null))
        )
      );

      if (!id_donacion) {
        this.notification.showError('Entrega no encontrada');
        this.isLoading = false;
        return;
      }

      await firstValueFrom(
        this.deliveriesService.deleteDeliverie(id_entrega)
      );

      await firstValueFrom(
        this.donationService.updateDonationAvailability(true, Number(id_donacion))
      );

      this.notification.showSuccess('Entrega eliminada correctamente');
      this.loadBeneficiariesWithDeliveries();
      this.loadAvailableProducts();
    } catch (error) {
      this.notification.showError('Error al eliminar la entrega');
      console.error('Error al eliminar la entrega:', error);
    } finally {
      this.isLoading = false;
    }
  }

  searchDeliverieByCedula() {
    const cedula = this.searchCedula.trim().toLowerCase();
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : new Date(); // si no hay fin, usamos hoy

    const filtered = this.allDeliveries.filter(d => {
      const matchesCedula = cedula ? d.cedula_beneficiario.toLowerCase().includes(cedula) : true;
      const deliverieDate = new Date(d.entrega.fecha_entrega);
      let matchesDate = true;

      if (start && !this.endDate) {
        matchesDate = deliverieDate >= start && deliverieDate <= end;
      } else if (start && this.endDate) {
        matchesDate = deliverieDate >= start && deliverieDate <= end;
      }

      return matchesCedula && matchesDate;
    });

    if (filtered.length === 0) {
      this.notification.showError('No se encontraron entregas con esos criterios.');
    } else {
      this.deliveries = filtered;
    }
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
          beneficiario_id: beneficiarie.id_beneficiario,
          nombres_beneficiario: beneficiarie.nombres_beneficiario,
          cedula_beneficiario: beneficiarie.cedula_beneficiario,
          direccion_beneficiario: beneficiarie.direccion_beneficiario,
          telefono_beneficiario: beneficiarie.telefono_beneficiario
        });
        this.successMessage = 'Donante encontrado';
        this.searchCedulaBeneficiario = '';
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

  clearSearch() {
    this.searchCedula = '';
    this.startDate = '';
    this.endDate = '';
    this.deliveries = this.allDeliveries;
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

  /* abrirEditModal(deli: any) {
    this.selectedDeliverie = deli;
    this.form.patchValue({
      nombres_beneficiario: deli.nombres_beneficiario,
      cedula_beneficiario: deli.cedula_beneficiario,
      direccion_beneficiario: deli.direccion_beneficiario,
      telefono_beneficiario: deli.telefono_beneficiario,
      id_donacion: deli.id_donacion
    });
    this.mostrarEditModal = true;
  } */

  abrirEditModal(deli: any) {
    this.selectedDeliverie = deli;
    const productoExistente = this.products.find(p => p.id_donacion === deli.entrega.id_donacion);

    // Si no está en la lista (porque está en `disponible = false`), lo agregas manualmente
    if (!productoExistente) {
      this.products.push({
        id_donacion: deli.entrega.id_donacion,
        detalle_donacion: deli.detalle_donacion,
        // puedes agregar otros campos si los necesitas para mostrarlo bien
      });
    }

    // Ahora haces el patchValue como se mostró antes
    this.form.patchValue({
      beneficiario_id: deli.entrega.id_beneficiario,
      nombres_beneficiario: deli.nombres_beneficiario,
      cedula_beneficiario: deli.cedula_beneficiario,
      direccion_beneficiario: deli.direccion_beneficiario,
      telefono_beneficiario: deli.telefono_beneficiario,
      id_donacion: deli.entrega.id_donacion
    });

    this.mostrarEditModal = true;
  }


  cerrarEditModal() {
    this.mostrarEditModal = false;
    this.selectedDeliverie = null;
  }

}
