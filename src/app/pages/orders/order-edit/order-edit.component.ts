import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, type OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Customer } from '../../../core/interfaces/customer';
import { ItemList } from '../../../core/interfaces/orders-list';
import { OrdersService } from '../../../core/services/orders.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderUpdate } from '../../../core/interfaces/order';
import { OrderDetailComponent } from '../order-detail/order-detail.component';
import { Status } from '../../../core/interfaces/status';
@Component({
  selector: 'app-order-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './order-edit.component.html',
  styleUrl: './order-edit.component.scss',
})
export class OrderEditComponent implements OnInit {
  isMobile: boolean = window.innerWidth <= 768;
  isVisibledTable: boolean = false;

  listDetailOrder: ItemList[] = [];
  listCustomer: Customer[] = [];
  orderNumber: string = '';
  totalAmount: number = 0;

  //PND = Pendiente, PRP = Preparando, SHP = Enviado, DLV = Entregado
  statusOrder: Status[] = [
    { code: 'PND', description: 'Pendiente' },
    { code: 'PRP', description: 'Preparando' },
    { code: 'SHP', description: 'Enviado' },
    {
      code: 'DLV',
      description: 'Entregado',
    },
  ];

  fieldLabels: { [key: string]: string } = {
    orderNumber: 'Número de Orden',
    customerId: 'Cliente',
    totalAmount: 'Total',
    shippingAddress: 'Dirección de Envío',
    billingAddress: 'Dirección de Facturación',
    items: 'Items',
    shippingMethod: 'Método de Envío',
    discount: 'Descuento',
    taxAmount: 'Impuesto',
  };

  orderForm = new FormGroup({
    id: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    status: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50),
    ]),
    totalAmount: new FormControl(0, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(18),
    ]),
    shippingAddress: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(150),
    ]),
    billingAddress: new FormControl('', [Validators.maxLength(150)]),
    shippingMethod: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    discount: new FormControl(0, [
      Validators.required,
      Validators.maxLength(18),
    ]),
    taxAmount: new FormControl(10.5, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(18),
    ]),
  });

  constructor(
    private ordersService: OrdersService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.route.paramMap.subscribe((params) => {
      const orderId = params.get('id');
      if (orderId) {
        this.ordersService.getOrderById(orderId).subscribe({
          next: (response) => {
            if (response.status === 200) {
              const order = response.body;

              this.orderForm.get('id')?.setValue(order.id);
              this.orderForm.get('status')?.setValue(order.status);
              this.orderForm
                .get('shippingAddress')
                ?.setValue(order.shippingAddress);
              this.orderForm
                .get('billingAddress')
                ?.setValue(order.billingAddress);
              this.orderForm
                .get('shippingMethod')
                ?.setValue(order.shippingMethod);
              this.orderForm.get('discount')?.setValue(order.discount);
              this.orderForm.get('taxAmount')?.setValue(order.taxAmount);
              this.listDetailOrder = order.items;
              this.calculateTotalAmount();
              this.orderNumber = order.orderNumber;
              this.cdr.detectChanges();
            } else {
              this.toastr.error(
                response.title || 'Ocurrió un error inesperado en el servidor',
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
    });
  }

  deleteDetailOrder(order: any) {
    this.listDetailOrder = this.listDetailOrder.filter(
      (item) => item.id !== order.id
    );
    this.calculateTotalAmount();
  }

  ngOnInit(): void {
    const linkOrderForm = localStorage.getItem('_linkOrderForm');
    const linkListDetailOrder = localStorage.getItem('_linkListDetailOrder');

    console.log('linkOrderForm =>', linkOrderForm);
    console.log('linkListDetailOrder =>', linkListDetailOrder);

    if (linkOrderForm) {
      this.orderForm.setValue(JSON.parse(linkOrderForm));
    }

    if (linkListDetailOrder) {
      this.listDetailOrder = JSON.parse(linkListDetailOrder);
      this.calculateTotalAmount();
    }
    window.addEventListener('beforeunload', this.saveFormState.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('beforeunload', this.saveFormState.bind(this));
    this.saveFormState();
  }

  saveFormState(): void {
    localStorage.setItem(
      '_linkOrderForm',
      JSON.stringify(this.orderForm.value)
    );
    localStorage.setItem(
      '_linkListDetailOrder',
      JSON.stringify(this.listDetailOrder)
    );
  }

  updateOrder(): void {
    this.orderForm.get('totalAmount')?.setValue(this.totalAmount);

    if (this.orderForm.invalid) {
      console.log('Formulario inválido', this.orderForm);
      this.orderForm.markAllAsTouched();
      return;
    }

    if (this.listDetailOrder.length === 0) {
      this.toastr.error(
        'Debe agregar al menos un item a la orden',
        'Validación',
        {
          timeOut: 2500,
          progressBar: true,
          toastClass: this.isMobile
            ? 'ngx-toastr toast-w300'
            : 'ngx-toastr toast-w500',
          progressAnimation: 'increasing',
        }
      );
      return;
    }

    const order: OrderUpdate = {
      id: this.orderForm.get('id')?.value || '',
      status: this.orderForm.get('status')?.value || '',
      totalAmount: this.orderForm.get('totalAmount')?.value || 0,
      shippingAddress: this.orderForm.get('shippingAddress')?.value || '',
      billingAddress: this.orderForm.get('billingAddress')?.value || '',
      shippingMethod: this.orderForm.get('shippingMethod')?.value || '',
      discount: this.orderForm.get('discount')?.value || 0,
      taxAmount: this.orderForm.get('taxAmount')?.value || 10.5,
      items: this.listDetailOrder,
    };

    console.log('Registro de Orden =>', order);

    this.ordersService.updateOrder(order).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.toastr.success('Orden actualizada correctamente', 'Éxito', {
            timeOut: 2500,
            progressBar: true,
            toastClass: this.isMobile
              ? 'ngx-toastr toast-w300'
              : 'ngx-toastr toast-w500',
            progressAnimation: 'increasing',
          });

          this.router.navigate(['/orders']);
        } else {
          console.error('Error al crear la orden', response.error.title);
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

  openOrderDetailDialog(): void {
    const dialogRef = this.dialog.open(OrderDetailComponent, {
      width: '340px',
      height: 'auto',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((product) => {
      //validar que el producto no exista en la lista
      const existingProduct = this.listDetailOrder.find(
        (item) => item.productId === product.productId
      );

      if (existingProduct) {
        this.toastr.warning(
          'El producto ya existe en la orden',
          'Información',
          {
            timeOut: 2500,
            progressBar: true,
            toastClass: this.isMobile
              ? 'ngx-toastr toast-w300'
              : 'ngx-toastr toast-w500',
            progressAnimation: 'increasing',
          }
        );
        return;
      }

      this.listDetailOrder.push(product);
      this.calculateTotalAmount();
    });
  }

  calculateTotalAmount(): void {
    this.totalAmount = this.listDetailOrder.reduce(
      (total, item) => total + item.quantity * item.product.unitPrice,
      0
    );
    console.log(this.totalAmount);
    this.orderForm.get('totalAmount')?.setValue(this.totalAmount);
    this.cdr.detectChanges();
  }

  getErrorMessage(field: string): string {
    const control = this.orderForm.get(field);
    if (control?.hasError('required')) {
      return `El campo ${this.getFieldLabel(field)} es obligatorio`;
    } else if (control?.hasError('minlength')) {
      return `Debe tener al menos ${control.errors?.['minlength'].requiredLength} caracteres`;
    } else if (control?.hasError('maxlength')) {
      return `Debe tener como máximo ${control.errors?.['maxlength'].requiredLength} caracteres`;
    } else if (control?.hasError('email')) {
      return `Por favor ingrese un correo electrónico válido`;
    } else if (control?.hasError('pattern')) {
      return `Por favor ingrese un valor válido`;
    }

    return '';
  }

  getFieldLabel(field: string): string {
    return this.fieldLabels[field] || field;
  }

  isFieldInvalid(field: string) {
    return (
      this.orderForm.get(field)?.invalid && this.orderForm.get(field)?.touched
    );
  }
}
