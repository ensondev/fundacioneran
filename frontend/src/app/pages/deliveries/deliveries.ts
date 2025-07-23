import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BeneficiariesService } from '../../services/beneficiaries.service';
import {
  faTrash,
  faPen,
  faMagnifyingGlass
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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

  private _formBuilder = inject(FormBuilder);
  private beneficiarieService = inject(BeneficiariesService);

  deliveries: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  mostrarModal = false;
  mostrarModalBeneficiarie = false;
  searchCedulaBeneficiario: string = '';




  DeliverieForm!: FormGroup;

  form = this._formBuilder.group({

  })

  formBeneficiarie = this._formBuilder.group({
    nombres_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    cedula_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    direccion_beneficiario: this._formBuilder.nonNullable.control('', Validators.required),
    telefono_beneficiario: this._formBuilder.nonNullable.control('', Validators.required)
  });

  ngOnInit(): void {
    this.loadBeneficiariesWithDeliveries();
  }

  loadBeneficiariesWithDeliveries() {

  }

  submit() {

  }

  submitBeneficiarie() {
    if (this.formBeneficiarie.invalid) return;

    const { nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario } = this.formBeneficiarie.getRawValue();
    this.isLoading = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.beneficiarieService.registerBeneficiaries(nombres_beneficiario, cedula_beneficiario, direccion_beneficiario, telefono_beneficiario).subscribe({
      next: (response) => {
        alert('Beneficiario registrado correctamente✅');
        this.successMessage = 'Beneficiario registrado correctamente';
        this.cerrarModalBeneficiarie();
        this.formBeneficiarie.reset();
        this.isLoading = false;
      },
      error: (error) => {
        alert('Error al registrar al beneficiario⛔');
        this.errorMessage = 'Error al registrar al beneficiario.';
        console.error('Error al crear donador:', error);
        this.isLoading = false;
      }
    })
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
