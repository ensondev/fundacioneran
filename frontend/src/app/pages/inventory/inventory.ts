import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faL
} from '@fortawesome/free-solid-svg-icons';
import { NotificationService } from '../../services/notification.service';
import { AuthStateService } from '../../shared/service/auth-state.service';
import { CategiriesService } from '../../services/categories.service';
import { InventoryService } from '../../services/inventory.service';
import { productsService } from '../../services/products.service';
import { WarehouseService } from '../../services/warehouses.service';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export default class Inventory implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  allCategories: any[] = [];
  categories: any[] = [];
  warehouses: any[] = [];
  products: any[] = [];
  allProducts: any[] = [];
  productsInventory: any[] = [];
  allProductsInventory: any[] = [];
  selectedInventory: any = null;

  userRole: string = '';
  searchProduct: string = '';
  searchCategorie: string = '';
  searchWarehouse: string = '';

  mostrarModal = false;
  mostrarEditModal = false;
  isLoading = false;

  private _formBuild = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private notification = inject(NotificationService);
  private productService = inject(productsService);
  private warehouseService = inject(WarehouseService);
  private categorieService = inject(CategiriesService);
  private inventoryService = inject(InventoryService);


  ProductsInventoryForm!: FormGroup;

  form = this._formBuild.group({
    producto_id: this._formBuild.control<number | null>(null, Validators.required),
    categoria_id: this._formBuild.control<number | null>(null, Validators.required),
    bodega_id: this._formBuild.control<number | null>(null, Validators.required),
    cantidad_disponible: this._formBuild.control<number | null>(null, Validators.required),
  });


  ngOnInit() {
    this.loadProductInventory();
    this.loadProducts();
    this.loadWarehouses();
    this.loadCategories();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadProductInventory() {
    this.isLoading = true;
    this.inventoryService.getProductsInventory().subscribe({
      next: (response) => {
        /* console.log('Inventario cargado:', response); */
        this.allProductsInventory = response;
        this.productsInventory = response;
        this.isLoading = false;
      }, error: (error) => {
        console.error('Error al cargar los productos del inventario:', error);
        this.isLoading = false;
      }
    })
  }

  loadProducts() {
    this.isLoading = true;

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

  loadWarehouses() {
    this.isLoading = true;

    this.warehouseService.getWarehouse().subscribe({
      next: (warehouse) => {
        this.warehouses = warehouse;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las bodegas:', error);
        this.isLoading = false;
      }
    });
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

  submit() {
    if (this.form.invalid) return;

    const { producto_id, categoria_id, bodega_id, cantidad_disponible } = this.form.getRawValue();

    this.isLoading = true;

    this.inventoryService.InsertProdutInventory(producto_id, categoria_id, bodega_id, cantidad_disponible).subscribe({
      next: (response) => {
        console.log('Respuesta al insertar producto:', response); // <-- agrega esto
        if (!response.p_status) {
          this.notification.showError(response.p_message); // <- Muestra el error si ya existe
          this.isLoading = false;
          return;
        }
        this.notification.showSuccess('producto agregado al inventario correctamente');
        this.loadProductInventory();
        this.form.reset();
        this.mostrarModal = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al agregar producto al inventario');
        console.error('Error al agregar producto al inventario:', error);
        this.isLoading = false;
      }
    })
  }

  updateProductInventory() {
    if (this.form.invalid || !this.selectedInventory) return;

    const { producto_id, categoria_id, bodega_id, cantidad_disponible } = this.form.getRawValue();
    const id_inventario = this.selectedInventory.id_inventario;

    this.isLoading = true;

    console.log('producto:', producto_id, 'bodega:', bodega_id, 'stock:', cantidad_disponible)

    this.inventoryService.updateProductInventory(producto_id, categoria_id, bodega_id, cantidad_disponible, id_inventario)
      .subscribe({
        next: (res) => {
          if (res.p_status) {
            this.notification.showSuccess(res.p_messaje || 'Producto actualizado correctamente');
            this.loadProductInventory(); // recarga inventario
            this.form.reset();
            this.cerrarEditModal(); // cierra modal de edición
          } else {
            this.notification.showError(res.p_messaje || 'No se pudo actualizar el producto');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al actualizar producto del inventario:', error);
          this.notification.showError('Error al actualizar producto del inventario');
          this.isLoading = false;
        }
      });
  }







  deleteProductInventory(id_inventario: number) {
    const confirmDelete = confirm('⚠️¿Estás seguro de que deseas eliminar este producto del inventario?⚠️');
    if (!confirmDelete) return;
    this.isLoading = true;

    this.inventoryService.deleteProductInventory(id_inventario).subscribe({
      next: (res) => {
        console.log(res)
        this.notification.showSuccess('Producto eliminado del inventario correctamente');
        this.loadProductInventory();
        this.isLoading = false;
      }, error: (error) => {
        this.notification.showError('Error al eliminar producto del inventario');
        console.error('Error al eliminar producto del inventario:', error);
        this.isLoading = false;
      }
    })
  }


  searchProduts() {
    const producto = this.searchProduct.trim().toLowerCase();
    const categoria = this.searchCategorie.trim().toLowerCase();
    const bodega = this.searchWarehouse.trim().toLowerCase();

    const filtered = this.allProductsInventory.filter(productInventory => {
      const matchesCategorie = categoria
        ? productInventory.nombre_categoria.toLowerCase() === categoria
        : true;

      const matchesProduct = producto ? productInventory.nombre_producto.toLowerCase() === producto : true;
      const matchesWarehouse = bodega ? productInventory.nombre_bodega.toLowerCase() === bodega : true;

      return matchesProduct && matchesCategorie && matchesWarehouse;
    });

    if (filtered.length === 0) {
      this.notification.showError('No se encontraron productos con esos criterios.');
    } else {
      this.productsInventory = filtered;
    }
  }

  clearSearch() {
    this.searchCategorie = '';
    this.searchProduct = '';
    this.searchWarehouse = '';
    this.productsInventory = this.allProductsInventory;
  }

  abrirModal() {
    this.form.reset();
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.form.reset();
    this.mostrarModal = false;
  }

  abrirEditModal(prodInv: any) {
    this.selectedInventory = prodInv;

    this.form.patchValue({
      producto_id: prodInv.producto_id,
      categoria_id: prodInv.categoria_id,
      cantidad_disponible: prodInv.cantidad_disponible,
      bodega_id: prodInv.bodega_id
    });

    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.mostrarEditModal = false;
    this.selectedInventory = null;
  }
}
