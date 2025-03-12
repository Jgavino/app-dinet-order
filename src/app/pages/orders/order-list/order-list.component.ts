import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdersList } from '../../../core/interfaces/orders-list';
import { OrdersService } from '../../../core/services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss',
})
export class OrderListComponent implements OnInit {
  isMobile: boolean = window.innerWidth <= 768;
  isVisibledTable: boolean = false;

  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 10;

  orderNumber: string = '';
  startDate: string = '';
  endDate: string = '';

  listOrder: OrdersList[] = [];

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.getAllOrders();
  }

  ngOnInit(): void {
    localStorage.removeItem('_linkListDetailOrder');
    localStorage.removeItem('_linkOrderForm');
  }

  searchOrderNumber() {
    //tinene que temer un valor minimo de 3 caracteres para realizar la busqueda
    if (this.orderNumber.length === 0) {
      this.getAllOrders();
    } else if (this.orderNumber.length < 3) {
      return;
    } else if (this.orderNumber.length >= 3) {
      this.getAllOrders(this.orderNumber);
    }
  }

  deleteOrder(order: any): void {
    this.ordersService.deleteOrder(order.id).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.toastr.success(
            `Se eliminó correctamente la order N° ${order.orderNumber}`,
            'Éxito',
            {
              timeOut: 2500,
              progressBar: true,
              toastClass: this.isMobile
                ? 'ngx-toastr toast-w300'
                : 'ngx-toastr toast-w500',
              progressAnimation: 'increasing',
            }
          );

          this.getAllOrders();
        } else {
          console.error('Error al eliminar la orden', response.error.title);
          this.toastr.error(
            'Ocurrió un error inesperado en el servidor',
            'Error',
            {
              timeOut: 2500,
              progressBar: true,
              toastClass: this.isMobile
                ? 'ngx-toastr toast-w300'
                : 'ngx-toastr toast-w500',
              progressAnimation: 'increasing',
            }
          );
        }
      },
    });
  }

  editarOrden(order: any): void {
    // Navegar a la página de edición
    this.router.navigate([`/orders/edit/${order.id}`]);
  }

  validateDateRange(): boolean {
    return new Date(this.startDate) <= new Date(this.endDate);
  }

  getAllOrders(
    orderNumber: string = '',
    startDate: string = '',
    endDate: string = '',
    pageNumber: number = 1,
    pageSize: number = 10
  ) {
    let isValid: boolean = false;

    if (this.startDate && this.endDate) {
      isValid = this.validateDateRange();
    } else {
      isValid = true;
    }

    // Invocar servicio de búsqueda
    if (isValid) {
      this.ordersService
        .getAllOrders({
          orderNumber,
          startDate,
          endDate,
          pageNumber,
          pageSize,
        })
        .subscribe({
          next: (response) => {
            if (response.status === 200) {
              console.log(this.isVisibledTable);
              console.log(response.body);
              this.listOrder = response.body.data;
              this.totalItems = response.body.totalRecords;
              this.currentPage = response.body.pageNumber;
              this.isVisibledTable = true;
              this.cdr.detectChanges();
            } else {
              this.isVisibledTable = false;
              this.toastr.error(
                'Ocurrió un error inesperado en el servidor',
                'Error',
                {
                  timeOut: 2500,
                  progressBar: true,
                  toastClass: this.isMobile
                    ? 'ngx-toastr toast-w300'
                    : 'ngx-toastr toast-w500',
                  progressAnimation: 'increasing',
                }
              );
            }
          },
        });
    } else {
      this.toastr.error('El rango de fecha no es correcto', 'Validación', {
        timeOut: 2500,
        progressBar: true,
        toastClass: this.isMobile
          ? 'ngx-toastr toast-w300'
          : 'ngx-toastr toast-w500',
        progressAnimation: 'increasing',
      });
    }
  }

  createOrder() {
    // Navegar a la página de creación
    this.router.navigate(['/orders/create']);
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.getAllOrders(
      this.orderNumber,
      this.startDate,
      this.endDate,
      this.currentPage,
      this.itemsPerPage
    );
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.getAllOrders(
        this.orderNumber,
        this.startDate,
        this.endDate,
        this.currentPage,
        this.itemsPerPage
      );
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getAllOrders(
        this.orderNumber,
        this.startDate,
        this.endDate,
        this.currentPage,
        this.itemsPerPage
      );
    }
  }

  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
}
