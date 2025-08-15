import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CashManagementService } from '../../services/cash-management.service';
import { NotificationService } from '../../services/notification.service';
import {
  faTrash,
  faPen,
  faMagnifyingGlass,
  faXmark,
  faTicket,
  faRupiahSign,
  faFileCsv,
} from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthStateService } from '../../shared/service/auth-state.service';
@Component({
  selector: 'app-cash-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, FontAwesomeModule],
  templateUrl: './cash-management.html',
  styleUrl: './cash-management.css'
})
export default class CashManagement implements OnInit {
  //iconos
  faTrash = faTrash;
  faPen = faPen;
  faMagnifyingGlass = faMagnifyingGlass;
  faXmark = faXmark;
  faTicket = faTicket;
  faFileCsv = faFileCsv;

  private formBuilder = inject(FormBuilder);
  private cashService = inject(CashManagementService);
  private notification = inject(NotificationService);
  private authStateService = inject(AuthStateService);

  allTransaction: any[] = [];
  transactions: any[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  saldoActual: number = 0;
  contadorIngresos: number = 0;
  contadorEgresos: number = 0;
  totalIngresos: number = 0;
  totalEgresos: number = 0;
  searchTransactions: string = '';
  startDate: string = '';
  endDate: string = '';
  userRol: string = '';

  mostrarModal = false;

  TransactionForm!: FormGroup;

  form = this.formBuilder.group({
    tipo_transaccion: this.formBuilder.nonNullable.control('', Validators.required),
    monto: this.formBuilder.control<number | null>(0, Validators.required),
    razon: this.formBuilder.nonNullable.control('', Validators.required)
  })

  ngOnInit() {
    this.loadTransactions();
    this.loadTotals();

    const session = this.authStateService.getSession();
    this.userRol = session ? session.rol : '';
  }

  loadTransactions() {
    this.isLoading = true;

    this.cashService.getTransaction().subscribe(
      {
        next: (trans) => {
          this.allTransaction = trans;
          this.transactions = trans;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar productos:', error);
          this.isLoading = false;
        }
      }
    );
  }

  loadTotals() {
    this.cashService.getIngresoSummary().subscribe({
      next: (res) => {
        this.totalIngresos = Number(res.total); // <- asegúrate de convertir a número
        this.contadorIngresos = Number(res.cantidad);
        this.calculateBalance();
      },
      error: (err) => {
        console.error('Error al obtener ingresos:', err);
      }
    });

    this.cashService.getEgresoSummary().subscribe({
      next: (res) => {
        this.totalEgresos = Number(res.total);
        this.contadorEgresos = Number(res.cantidad);
        this.calculateBalance();
      },
      error: (err) => {
        console.error('Error al obtener egresos:', err);
      }
    });
  }

  registerTransaction() {
    if (this.form.invalid) return;

    const { tipo_transaccion, monto, razon } = this.form.getRawValue();

    if (tipo_transaccion === 'Egreso' && monto! > this.saldoActual) {
      this.notification.showError('El monto del egreso no puede ser mayor al saldo actual');
      return;
    }

    this.isLoading = true;

    this.cashService.registerTransaction(tipo_transaccion, monto, razon).subscribe({
      next: () => {
        this.notification.showSuccess('Transacción realizada correctamente');
        this.loadTransactions();
        this.loadTotals();

        this.cerrarModal();
        this.form.reset();
        this.isLoading = false;
      },
      error: (error) => {
        this.notification.showError('Error al realizar la transacción');
        console.error('Error al realizar la transferencia:', error);
        this.isLoading = false;
      }
    });
  }

  searchTransaction() {
    const tipo = this.searchTransactions?.trim().toLowerCase();
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : new Date(); // Si no hay endDate, usa fecha actual

    const filtered = this.allTransaction.filter(trans => {
      const transTipo = tipo ? trans.tipo_transaccion?.toLowerCase().includes() : true;
      const transactionDate = new Date(trans.fecha_transaccion);
      let matchesDate = true;
      if (start && !this.endDate) {
        matchesDate = transactionDate >= start && transactionDate <= end;
      } else if (start && this.endDate) {
        matchesDate = transactionDate >= start && transactionDate <= end;
      }

      return transTipo && matchesDate;
    });

    if (filtered.length === 0) {
      this.notification.showError('No se encontraron entregas con esos criterios.');
    } else {
      this.transactions = filtered;
    }
  }

  generarReporteExcel() {
    const data = this.transactions.map(t => ({
      'N°': t.id_transaccion,
      'Tipo': t.tipo_transaccion,
      'Monto': t.monto,
      'Fecha': new Date(t.fecha_transaccion).toLocaleDateString(),
      'Razon': t.razon
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    //Definir ancho para cada columna (en caracteres)
    worksheet['!cols'] = [
      { wch: 5 },   // ID
      { wch: 15 },  // tipo
      { wch: 15 },  // monto
      { wch: 15 },  // Fecha
      { wch: 35 },  // Razon
    ];

    const workbook: XLSX.WorkBook = {
      Sheets: { 'Transacciones': worksheet },
      SheetNames: ['Transacciones']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    FileSaver.saveAs(blob, 'Reporte_Transacciones.xlsx');
  }


  calculateBalance(): void {
    this.saldoActual = this.totalIngresos - this.totalEgresos;
  }


  contarIngresos(): number {
    return this.contadorIngresos;
  }

  contarEgresos(): number {
    return this.contadorEgresos;
  }

  clearSearch() {
    this.searchTransactions = '';
    this.startDate = '';
    this.endDate = '';
    this.transactions = this.allTransaction;
  }

  abrirModal() {
    this.mostrarModal = true;
    this.form.reset({
      tipo_transaccion: '',
      monto: null,
      razon: '',
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
  }
}
