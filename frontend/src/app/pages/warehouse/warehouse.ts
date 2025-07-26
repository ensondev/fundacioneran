import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { WarehouseService } from '../../services/warehouses.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-warehouse',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './warehouse.html',
  styleUrl: './warehouse.css'
})
export default class Warehouse implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private warehouseService = inject(WarehouseService);
  private notification = inject(NotificationService);

  warehouses: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedWarehouse: any = null;
  mostrarModal = false;
  mostrarEditModal = false;
  userRole: string = '';

  WarehousesForm!: FormGroup;

  form = this._formBuilder.group({
    nombre_bodega: this._formBuilder.nonNullable.control('', Validators.required),
    ubicacion: this._formBuilder.nonNullable.control('', Validators.required),
  });

  ngOnInit(): void {
    this.loadWarehouses();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadWarehouses() {
    this.isLoading = true;
    this.errorMessage = null;

    this.warehouseService.getWarehouse().subscribe({
      next: (warehouse) => {
        this.warehouses = warehouse;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las bodegas. Intente nuevamente.';
        console.error('Error al cargar las bodegas:', error);
        this.isLoading = false;
      }
    });
  }

  submitWarehouse() {
    if (this.form.invalid) return;

    const { nombre_bodega, ubicacion } = this.form.getRawValue();

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.warehouseService.createWarehouse(nombre_bodega, ubicacion).subscribe({
      next: (response) => {
        this.notification.showSuccess('Bodega creada correctamente');
        this.loadWarehouses();
        this.cerrarModal();
        this.form.reset();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al crear la bodega');
        console.error('error al crear la bodega:', error);
        this.isLoading = false;
      }
    });
  }

  updateWarehouse() {
    if (this.form.invalid || !this.selectedWarehouse) return;

    const { nombre_bodega, ubicacion } = this.form.getRawValue();

    const id_bogeda = this.selectedWarehouse.id_bodega;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.warehouseService.updateWarehouse(nombre_bodega, ubicacion, id_bogeda).subscribe({
      next: (response) => {
        console.log(response);
        this.notification.showSuccess('Bodega actualizada correctamente');
        this.loadWarehouses();
        this.cerrarEditModal();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al actualizar la bodega');
        console.error('Error al actualizar la bodega:', error);
        this.isLoading = false;
      }
    })
  }

  deleteWarehouse(id_bodega: number) {
    if (!confirm('⚠️¿Seguro que quieres eliminar esta bodega?⚠️')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.warehouseService.deleteWarehouse(id_bodega).subscribe({
      next: () => {
        this.notification.showSuccess('Bodega eliminada correctamente');
        this.loadWarehouses();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al eliminar la bodega');
        console.error('Error al eliminar bodega:', error);
        this.isLoading = false;
      }
    });
  }

  abrirEditModal(ware: any) {
    this.selectedWarehouse = ware;
    this.form.patchValue({
      nombre_bodega: ware.nombre_bodega,
      ubicacion: ware.ubicacion
    });
    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.form.reset();
    this.mostrarEditModal = false;
    this.selectedWarehouse = null;
  }

  abrirModal() {
    this.form.reset();
    this.selectedWarehouse = null;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.form.reset();
    this.mostrarModal = false;
  }
}
