import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { productsService } from '../../services/products.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { CategiriesService } from '../../services/categories.service';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export default class Products implements OnInit {

  products: any[] = [];
  allProducts: any[] = [];
  categories: any[] = [];

  userRole: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;

  isLoading = false;
  mostrarModal = false;
  mostrarModalCategorie = false;

  private _formBuild = inject(FormBuilder);
  private productService = inject(productsService);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private categorieService = inject(CategiriesService);

  ProductForm!: FormGroup;

  form = this._formBuild.group({
    es_caducible: this._formBuild.nonNullable.control(false, Validators.required),
    nombre_producto: this._formBuild.nonNullable.control('', Validators.required),
    detalle_producto: this._formBuild.nonNullable.control(''),
    categoria_id: this._formBuild.nonNullable.control<number>(0, Validators.required),
    fecha_caducidad: this._formBuild.nonNullable.control<Date>(new Date),
    precio_venta: this._formBuild.nonNullable.control<number>(0, Validators.required),
  });

  formCategorie = this._formBuild.group({
    nombre_categoria: this._formBuild.nonNullable.control('', Validators.required)
  });


  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadProducts() {
    this.isLoading = true;
    this.errorMessage = null;

    this.productService.getProducts().subscribe({
      next: (product) => {
        this.allProducts = product;
        this.products = product;
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al cargar productos:', error);
        this.isLoading = false;
      }
    })
  }

  loadCategories() {
    this.categorieService.getCategories().subscribe({
      next: (categorie) => {
        this.categories = categorie;
      },
      error: (err) => {
        console.error('Error cargando categorías:', err);
      }
    });
  }

  submitCategories() {
    if (this.formCategorie.invalid) return;

    const nombre_categoria = this.formCategorie.get('nombre_categoria')?.value ?? '';

    this.isLoading = true;

    this.categorieService.insertCategorie(nombre_categoria).subscribe({
      next: (res) => {
        this.notification.showSuccess('Categoría registrada correctamente');
        this.loadCategories();  // Recarga lista
        this.formCategorie.reset();
        this.isLoading = false;
        this.mostrarModalCategorie = false; // Cierra modal al guardar
      },
      error: (error) => {
        this.notification.showError('Error al guardar la categoría');
        console.error('Error al registrar categoría:', error);
        this.isLoading = false;
      }
    });
  }

  submit() {
    if (this.form.invalid) return;

    if (!this.form.value.precio_venta || this.form.value.precio_venta < 0) {
      this.notification.showError('Debe ingresar un precio válido');
      return;
    }

    const { es_caducible, nombre_producto, detalle_producto, categoria_id, fecha_caducidad, precio_venta } = this.form.getRawValue();

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.productService.registerProduct(
      es_caducible,
      nombre_producto,
      detalle_producto,
      categoria_id,
      fecha_caducidad,
      precio_venta
    ).subscribe({
      next: (data) => {
        this.notification.showSuccess('Producto registrado correctamente');
        this.loadProducts();
        this.form.reset();
        this.isLoading = false;
      }, error: (error) => {

      }
    })
  }

  abrirModal() {
    this.form.reset();
    this.mostrarModal = true;
  }

  abrirModalCategorie() {
    this.formCategorie.reset();
    this.mostrarModalCategorie = true;
  }

  cerrarModal() {
    this.form.reset();
    this.mostrarModal = false;
  }

  cerrarEditModal() {
    this.form.reset();
    this.mostrarModalCategorie = false;
  }
}

