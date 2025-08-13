import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faRupiahSign
} from '@fortawesome/free-solid-svg-icons';
import { InventoryService } from '../../services/inventory.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { SalesMadeService } from '../../services/sales.service';
@Component({
  selector: 'app-sales-made',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  templateUrl: './sales-made.html',
  styleUrl: './sales-made.css'
})
export default class SalesMade implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  searchCedula: string = '';
  startDate: string = '';
  endDate: string = '';
  userRole: string = '';
  allSalesMade: any[] = [];
  salesMade: any[] = [];
  productsInventory: any[] = [];
  allProductsInventory: any[] = [];
  productosAgregados: any[] = [];
  selectedSales: any = null;

  mostrarModal = false;
  isLoading = false;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private inventoryService = inject(InventoryService);
  private saleMadeService = inject(SalesMadeService);

  salesMadeForm!: FormGroup;

  form = this._formBuilder.group({
    nombre_cliente: this._formBuilder.nonNullable.control('', Validators.required),
    cedula_cliente: this._formBuilder.nonNullable.control('', Validators.required),
    total: this._formBuilder.nonNullable.control<number>(0, Validators.required),
    id_inventario: this._formBuilder.nonNullable.control<number>(0, Validators.required),
    cantidad: this._formBuilder.nonNullable.control<number>(0, Validators.required),
    precio_unitario: this._formBuilder.nonNullable.control<number>(0, Validators.required),
  });

  ngOnInit() {
    this.loadProductInventory();
    this.loadSalesMade();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
    this.form.controls['id_inventario'].valueChanges.subscribe((id_inventario) => {
      const producto = this.productsInventory.find(p => p.id_inventario === +id_inventario);
      if (producto) {
        this.form.controls['precio_unitario'].setValue(producto.precio_venta);
      }
    });
  }


  loadSalesMade() {
    this.isLoading = true;
    this.saleMadeService.getSalesMade().subscribe({
      next: (response) => {
        this.salesMade = response;
        this.allSalesMade = response;
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al cargar las ventas');
        this.isLoading = false;
      }
    });
  }


  loadProductInventory() {
    this.isLoading = true;
    this.inventoryService.getProductsInventory().subscribe({
      next: (response) => {
        this.allProductsInventory = response;
        this.productsInventory = response;
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al cargar los productos del inventario:', error);
        this.isLoading = false;
      }
    })
  }

  submit() {
    if (this.form.controls['nombre_cliente'].invalid || this.form.controls['cedula_cliente'].invalid || this.productosAgregados.length === 0) return;

    const { nombre_cliente, cedula_cliente } = this.form.getRawValue();
    const total = this.calcularTotal();

    this.saleMadeService.insertHeader(nombre_cliente, cedula_cliente, total).subscribe({
      next: (res) => {
        const id_venta = Number(res?.sub);

        for (const detalle of this.productosAgregados) {

          const insertDetalle = {
            id_venta,
            id_inventario: +detalle.id_inventario,
            cantidad: +detalle.cantidad,
            precio_unitario: +detalle.precio_unitario,
          };

          console.log('Insertando detalle:', insertDetalle);

          /* this.updateStockProducto(insertDetalle.id_inventario, insertDetalle.cantidad); */

          this.saleMadeService.insertDetails(insertDetalle).subscribe({
            next: (res) => {
              console.log('Detalle insertado con éxito');
              this.updateStockProducto(insertDetalle.id_inventario, insertDetalle.cantidad);
              this.loadProductInventory();
            },
            error: (err) => {
              console.error('Error al insertar detalle:', err);
              this.notification.showError('Error al guardar un detalle de la venta');
            }
          });
        }

        this.notification.showSuccess('Venta registrada con éxito');
        /* this.loadProductInventory(); */
        this.cerrarModal();
        this.form.reset();
        this.productosAgregados = [];
        this.loadSalesMade();
      },
      error: () => this.notification.showError('Error al registrar la cabecera de la venta')
    });
  }

  updateStockProducto(id_inventario: number, cantidadVendida: number) {
    this.inventoryService.updateStock(id_inventario, cantidadVendida).subscribe({
      next: () => console.log(`Stock actualizado para producto ${id_inventario}`),
      error: () => this.notification.showError('Error al actualizar el stock del producto')
    });
  }

  searchSalesMade() {
    const cedula = this.searchCedula.trim().toLowerCase();
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : new Date();

    const filtered = this.allSalesMade.filter(sales => {
      const matchesCedula = cedula
        ? sales.cedula_cliente?.toLowerCase().includes(cedula) ?? false
        : true;

      const saleDate = new Date(sales.fecha_venta);
      let matchesDate = true;

      if (start && !this.endDate) {
        matchesDate = saleDate >= start && saleDate <= end;
      } else if (start && this.endDate) {
        matchesDate = saleDate >= start && saleDate <= end;
      }

      return matchesCedula && matchesDate;
    });

    if (filtered.length === 0) {
      this.notification.showError('No se encontraron ventas con esos criterios');
    } else {
      this.salesMade = filtered;
    }
  }


  setProductPrice() {
    const id_inventario = this.form.controls['id_inventario'].value;
    const prod = this.productsInventory.find(p => p.id_inventario === id_inventario);
    if (prod) {
      this.form.controls['precio_unitario'].setValue(prod.precio_venta);
    }
  }

  agregarProducto() {
    const { id_inventario, cantidad, precio_unitario } = this.form.getRawValue();
    console.log('Agregar producto con:', id_inventario, cantidad, precio_unitario);

    const producto = this.productsInventory.find(p => p.id_inventario === +id_inventario);

    if (!producto) {
      this.notification.showError('Producto no encontrado');
      return;
    }

    if (cantidad > producto.cantidad_disponible) {
      this.notification.showError('No hay suficiente stock disponible.');
      return;
    }

    const yaExiste = this.productosAgregados.find(p => p.id_inventario === +id_inventario);
    if (yaExiste) {
      this.notification.showError('Este producto ya fue agregado.');
      return;
    }

    const subtotal = cantidad * precio_unitario;

    this.productosAgregados.push({
      id_inventario,
      nombre_producto: producto.nombre_producto,
      nombre_bodega: producto.nombre_bodega,
      cantidad,
      precio_unitario,
      subtotal
    });

    console.log('Productos agregados:', this.productosAgregados);

    // Limpiar campos de producto
    this.form.controls['id_inventario'].reset();
    this.form.controls['cantidad'].reset();
    this.form.controls['precio_unitario'].reset();
  }


  eliminarProducto(index: number) {
    this.productosAgregados.splice(index, 1);
  }

  calcularTotal(): number {
    return this.productosAgregados.reduce((total, item) => total + item.subtotal, 0);
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  clearSearch() {
    this.searchCedula = '';
    this.startDate = '';
    this.endDate = '';
    this.salesMade = this.allSalesMade;
  }
}
