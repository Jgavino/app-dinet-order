import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/interfaces/product';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss',
})
export class OrderDetailComponent implements OnInit {
  isMobile: boolean = window.innerWidth <= 768;

  textResponseVerify: string = '';

  listProducts: Product[] = [];
  orderDetailForm: FormGroup;

  fieldLabels: { [key: string]: string } = {
    productId: 'Producto',
    quantity: 'Cantidad',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OrderDetailComponent>,
    private productService: ProductService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.orderDetailForm = new FormGroup({
      productId: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
      ]),
      quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    });

    this.productService.getAllProducts().subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.listProducts = response.body;
          this.cdr.detectChanges();
        } else {
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

  ngOnInit() {}

  closeModal(): void {
    if (this.orderDetailForm.invalid) {
      this.orderDetailForm.markAllAsTouched();
      return;
    }

    const product = this.listProducts.find(
      (product) => product.id === this.orderDetailForm.get('productId')?.value
    );

    this.dialogRef.close({
      productId: this.orderDetailForm.get('productId')?.value,
      quantity: this.orderDetailForm.get('quantity')?.value,
      product: product,
    });
  }

  getErrorMessage(field: string): string {
    const control = this.orderDetailForm.get(field);
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
      this.orderDetailForm.get(field)?.invalid &&
      this.orderDetailForm.get(field)?.touched
    );
  }
}
