import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { productsService } from '../../services/products.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { NotificationService } from '../../services/notification.service';
import { CommonModule } from '@angular/common';
import { CategiriesService } from '../../services/categories.service';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-products',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export default class Products implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  products: any[] = [];
  allProducts: any[] = [];
  allCategories: any[] = [];
  categories: any[] = [];

  userRole: string = '';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  selectedProducts: any = null;
  searchCategorie: string = '';
  searchFechaCaducidad: string = '';
  searchClasification: string = '';

  isLoading = false;
  mostrarModal = false;
  mostrarModalCategorie = false;
  mostrarEditModal = false;

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
    fecha_caducidad: this._formBuild.nonNullable.control(''),
    precio_venta: this._formBuild.nonNullable.control<number>(0, Validators.required),
  });

  formEdit = this._formBuild.group({
    es_caducible: this._formBuild.nonNullable.control(false, Validators.required),
    nombre_producto: this._formBuild.nonNullable.control('', Validators.required),
    detalle_producto: this._formBuild.nonNullable.control(''),
    categoria_id: this._formBuild.nonNullable.control<number>(0, Validators.required),
    fecha_caducidad: this._formBuild.nonNullable.control(''),
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

    this.productService.getProductsWithCategories().subscribe({
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
    const fechaFinal = es_caducible ? fecha_caducidad : null;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.productService.registerProduct(
      es_caducible,
      nombre_producto,
      detalle_producto,
      categoria_id,
      fechaFinal,
      precio_venta
    ).subscribe({
      next: (data) => {
        this.notification.showSuccess('Producto registrado correctamente');
        this.loadProducts();
        this.form.reset();
        this.form.get('es_caducible')?.setValue(false); // reestablece checkbox
        this.isLoading = false;
        this.cerrarModal();
      }, error: (error) => {
        this.notification.showError('Error al registrar el producto');
        this.form.reset();
        this.isLoading = false;
      }
    })
  }

  updateProduct() {
    if (this.formEdit.invalid || !this.selectedProducts) return;

    const {
      es_caducible,
      nombre_producto,
      detalle_producto,
      categoria_id,
      fecha_caducidad,
      precio_venta
    } = this.formEdit.getRawValue();

    const fechaFinal = es_caducible ? fecha_caducidad : null;

    this.isLoading = true;

    this.productService.updateProduct(
      this.selectedProducts.id_producto,
      es_caducible,
      nombre_producto,
      detalle_producto,
      categoria_id,
      fechaFinal,
      precio_venta
    ).subscribe({
      next: () => {
        this.notification.showSuccess('Producto actualizado correctamente');
        this.loadProducts();
        this.formEdit.reset();
        this.mostrarEditModal = false;
        this.selectedProducts = null;
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al actualizar el producto');
        console.error('Error al actualizar:', error);
        this.isLoading = false;
      }
    });
  }


  deleteProduct(id_producto: number) {
    const confirmDelete = confirm('⚠️¿Estás seguro de que deseas eliminar este producto?⚠️');

    if (!confirmDelete) return;

    this.productService.deleteProduct(id_producto).subscribe({
      next: () => {
        this.notification.showSuccess('Producto eliminado correctamente');
        this.loadProducts(); // vuelve a cargar la lista
      },
      error: (err) => {
        console.error('Error al eliminar producto:', err);
        this.notification.showError('No se pudo eliminar el producto');
      }
    });
  }

  searchProdutsByCategorie() {
    const categoria = this.searchCategorie.trim().toLowerCase();
    const clasificacionStr = this.searchClasification;
    const clasificacion = clasificacionStr === 'true' ? true : (clasificacionStr === 'false' ? false : null);
    const fechaFiltro = this.searchFechaCaducidad
      ? new Date(this.searchFechaCaducidad).toISOString().split('T')[0]
      : null;

    const filtered = this.allProducts.filter(product => {
      const matchesCategorie = categoria
        ? product.nombre_categoria.toLowerCase() === categoria
        : true;

      const matchesClasification = clasificacion !== null
        ? product.es_caducible === clasificacion
        : true;

      const matchesDate = fechaFiltro
        ? new Date(product.fecha_caducidad).toISOString().split('T')[0] === fechaFiltro
        : true;

      return matchesCategorie && matchesClasification && matchesDate;
    });

    if (filtered.length === 0) {
      this.notification.showError('No se encontraron productos con esos criterios.');
    } else {
      this.products = filtered;
    }
  }

  abrirEditModal(prod: any) {
    this.selectedProducts = prod;
    this.formEdit.patchValue({
      es_caducible: prod.es_caducible,
      nombre_producto: prod.nombre_producto,
      detalle_producto: prod.detalle_producto,
      categoria_id: prod.categoria_id,
      fecha_caducidad: prod.fecha_caducidad,
      precio_venta: prod.precio_venta
    })
    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.formEdit.reset();
    this.mostrarEditModal = false;
  }

  clearSearch() {
    this.searchCategorie = '';
    this.searchClasification = ''
    this.searchFechaCaducidad = '';
    this.products = this.allProducts;
  }

  abrirModal() {
    this.form.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.form.reset();
    this.mostrarModal = false;
  }

  abrirModalCategorie() {
    this.formCategorie.reset();
    this.mostrarModalCategorie = true;
  }

  cerrarCategorieModal() {
    this.formCategorie.reset();
    this.mostrarModalCategorie = false;
  }
}

