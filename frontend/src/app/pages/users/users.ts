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
import { AuthStateService } from '../../shared/service/auth-state.service';
import { UsersService } from '../../services/users.service';
import { NotificationService } from '../../services/notification.service';
@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, FontAwesomeModule],
  templateUrl: './users.html',
  styles: ``,
  styleUrl: 'users.css'
})
export default class Users implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;

  private _formBuilder = inject(FormBuilder);
  private authStateService = inject(AuthStateService);
  private userService = inject(UsersService);
  private notification = inject(NotificationService);

  users: any[] = [];
  allUsers: any[] = [];
  selectedUsers: any = null;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  userRole: string = '';
  searchUser: string = '';
  mostrarModal = false;
  mostrarEditModal = false;

  UsersForm!: FormGroup;

  form = this._formBuilder.group({
    nombres_completo: this._formBuilder.nonNullable.control('', Validators.required),
    apellidos_completos: this._formBuilder.nonNullable.control('', Validators.required),
    nombre_usuario: this._formBuilder.nonNullable.control('', Validators.required),
    fecha_nacimiento: this._formBuilder.nonNullable.control('', Validators.required),
    genero: this._formBuilder.nonNullable.control('', Validators.required),
    numero_telefono: this._formBuilder.nonNullable.control('', Validators.required),
    correo: this._formBuilder.nonNullable.control('', Validators.required),
    rol_usuario: this._formBuilder.nonNullable.control('', Validators.required),
    password: this._formBuilder.nonNullable.control('', Validators.required),
    /* cuenta_activa: this._formBuilder.nonNullable.control(true, Validators.required), */
  })

  formEdit = this._formBuilder.group({
    nombre_usuario: this._formBuilder.nonNullable.control('', Validators.required),
    password: this._formBuilder.nonNullable.control(''),
  })

  ngOnInit(): void {
    this.loadUsers();
    const session = this.authStateService.getSession();
    this.userRole = session ? session.rol : '';
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = null;

    this.userService.getUsers().subscribe({
      next: (user) => {
        this.users = user;
        this.allUsers = user;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los usuarios. Intente nuevamente.';
        console.error('Error al cargar los usuarios:', error);
        this.isLoading = false;
      }
    })
  }

  submitUser() {
    if (this.form.invalid) return;

    const { nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, rol_usuario, password } = this.form.getRawValue();

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userService.createUser(nombres_completo, apellidos_completos, nombre_usuario, fecha_nacimiento, genero, numero_telefono, correo, rol_usuario, password).subscribe({
      next: (response) => {
        this.notification.showSuccess('Usuario creado correctamente');
        this.cerrarModal();
        this.loadUsers();
        this.form.reset();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al crear el usuario');
        this.isLoading = false;
        console.error('Error al crear el usuario:', error);
      }
    });
  }

  abrirEditModal(user: any) {
    this.selectedUsers = user;
    this.formEdit.patchValue({
      nombre_usuario: user.nombre_usuario,
    });
    this.formEdit.get('password')?.setValue('');
    this.mostrarEditModal = true;
  }

  cerrarEditModal() {
    this.formEdit.reset();
    this.mostrarEditModal = false;
    this.selectedUsers = null;
  }

  updateSubmit() {
    if (this.formEdit.invalid || !this.selectedUsers) return;

    const { nombre_usuario, password } = this.formEdit.getRawValue();
    const id_usuario = this.selectedUsers.id_usuario;

    const payload: any = {
      nombre_usuario,
      id_usuario
    };

    if (password.trim() !== '') {
      payload.password = password; // Solo si se quiere cambiar
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userService.updateUser(payload).subscribe({
      next: (response) => {
        console.log(response)
        this.notification.showSuccess('Usuario actualizado correctamente');
        this.cerrarEditModal();
        this.loadUsers();
        this.isLoading = false;
      },
      error: (err) => {
        this.notification.showError('Usuario actualizado correctamente');
        console.error('Error al actualizar el usuario:', err);
        this.isLoading = false;
      }
    })
  }

  deleteUser(id_usuario: number) {
    if (!confirm('⚠️¿Seguro que quieres eliminar este usuario?⚠️')) return;

    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userService.deleteUser(id_usuario).subscribe({
      next: () => {
        this.notification.showSuccess('Usuario eliminada correctamente');
        this.loadUsers();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Usuario eliminada correctamente');
        console.error('Error al eliminar usuario:', error);
        this.isLoading = false;
      }
    })
  }

  searchByUser() {
    if (!this.searchUser.trim()) {
      /* this.loadUsers(); */
      this.notification.showError('Por favor ingresa un nombre para buscar.');
      return;
    }

    this.isLoading = true;

    this.userService.getUserName(this.searchUser).subscribe({
      next: (user) => {
        console.log(user)
        if (user.length === 0) {
          this.loadUsers();
          this.notification.showError('No se encontraron usuarios con ese nombre.');
        }
        if (user) {
          this.users = user;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al buscar usuario', err);
        this.isLoading = false;
      }
    });
  }

  clearSearch() {
    this.searchUser = '';
    this.users = this.allUsers;
  }

  abrirModal() {
    this.form.reset();
    this.selectedUsers = null;
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.form.reset();
    this.mostrarModal = false;
  }
}
