import { Component, inject, OnInit } from '@angular/core';
import { PRIMEMG_MODULES } from './edit-delete.imports';
import { ListService } from '../../services/list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/products.interfaces';
import { MessageService } from 'primeng/api';
import { DeleteService } from '../../services/delete.service';
import { RegisterDetailsService } from '../../services/register-details.service';

@Component({
  selector: 'app-edit-delete',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule, CommonModule],
  templateUrl: './edit-delete.component.html',
  styleUrl: './edit-delete.component.scss',
  providers: [MessageService],
})
export default class EditDeleteComponent {
  reportOptions = [
    { label: 'Trabajadores', value: 'trabajadores' },
    { label: 'Areas', value: 'areas' },
    { label: 'Vehiculos', value: 'vehiculos' },
  ];

  visible: boolean = false;
  trabajadoresOptions: any[] = [];
  idRegistrosOptions: any[] = [];
  selectedReport: string | undefined;
  selectedTrabajador: string | undefined;
  selectedIdRegistro: string | undefined;
  registroDetalles: any[] = [];
  selectedProduct: any = null;

  productosOptions: any[] = [];
  selectedNewProduct: any = null;
  newProductQuantity: number = 0;
  loading: boolean = false;

  private srvList = inject(ListService);
  private messageService = inject(MessageService);
  private deleteService = inject(DeleteService);
  private registerDetailsService = inject(RegisterDetailsService);


  ngOnInit() {
    this.srvList.getlistProducts().subscribe(
      (res) => {
        this.productosOptions = res.data
          .filter((product: any) => product.stock_producto > 0 && product.estado_producto === 1)
          .map((product: any) => ({
            label: `${product.nombre_producto} (Código: ${product.codigo_producto})`,
            value: product,
          }));
      },
      (error) => console.error('Error fetching Productos:', error)
    );
  }

  onNewProductChange(event: any) {
    this.selectedNewProduct = event.value;
    this.newProductQuantity = 0; // Reset quantity when a new product is selected
  }



  onDeleteDetalle(detalleId: number) {
    this.loading = true;
    this.deleteService.requestdeletedetalle(detalleId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Detalle eliminado exitosamente',
        });
        // Remove the deleted detail from registroDetalles array
        this.registroDetalles = this.registroDetalles.filter(detalle => detalle.id_tbl_registro_detalles !== detalleId);
        this.resetForm();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error deleting Registro Detalle:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Hubo un problema al eliminar el detalle del registro',
        });
      }
    );
  }

  onReportChange(event: any) {
    if (this.selectedReport === 'trabajadores') {
      this.srvList.getReportsTrabajadores().subscribe(
        (res) => {
          console.log('Trabajadores Report:', res.data);
          const uniqueTrabajadores = new Map();
          res.data.forEach((item: any) => {
            if (!uniqueTrabajadores.has(item.cedula)) {
              uniqueTrabajadores.set(item.cedula, {
                label: `${item.nombre} (${item.cedula})`,
                value: item.cedula,
              });
            }
          });
          this.trabajadoresOptions = Array.from(uniqueTrabajadores.values());
        },
        (error) => console.error('Error fetching Trabajadores report:', error)
      );
    } else {
      // Reset trabajadoresOptions if another report type is selected
      this.trabajadoresOptions = [];
      this.selectedTrabajador = undefined;
      this.idRegistrosOptions = [];
      this.selectedIdRegistro = undefined;
      this.registroDetalles = [];
      this.selectedProduct = null;
    }
  }

  onTrabajadorChange(event: any) {
    const selectedTrabajadorCedula = event.value;
    this.srvList.getReportsTrabajadores().subscribe(
      (res) => {
        const registros = res.data.filter(
          (item: any) => item.cedula === selectedTrabajadorCedula
        );
        const uniqueRegistros = new Set<number>();
        const uniqueIdRegistrosOptions: { label: string; value: number }[] = [];

        registros.forEach((item: any) => {
          if (!uniqueRegistros.has(item.id_tbl_registros)) {
            uniqueRegistros.add(item.id_tbl_registros);
            uniqueIdRegistrosOptions.push({
              label: `ID Registro: ${item.id_tbl_registros}`,
              value: item.id_tbl_registros,
            });
          }
        });

        this.idRegistrosOptions = uniqueIdRegistrosOptions;
        console.log('ID Registros Options:', this.idRegistrosOptions);
      },
      (error) => console.error('Error fetching ID Registros:', error)
    );
  }

  onIdRegistroChange(event: any) {
    const selectedIdRegistro = event.value;
    this.srvList.getReportsTrabajadores().subscribe(
      (res) => {
        const detalles = res.data.filter(
          (item: any) => item.id_tbl_registros === selectedIdRegistro
        );
        console.log('Detalles:', detalles);

        this.registroDetalles = detalles.map((item: any) => ({
          id_tbl_registro_detalles: item.id_tbl_registro_detalles,
          codigo_producto: item.codigo_producto,
          id_tbl_productos: item.id_tbl_productos,
          nombre_producto: item.nombre_producto,
          stock_producto: item.stock_producto,
          cantidad: item.cantidad,
        }));
        console.log('Registro Detalles:', this.registroDetalles);
      },
      (error) => console.error('Error fetching Registro Detalles:', error)
    );
  }

  onEditProduct(product: any) {
    this.selectedProduct = product;
  }


  onReplaceProduct() {
    this.loading = true;
    if (this.selectedNewProduct && this.newProductQuantity > 0) {
      const originalProductStock = this.selectedProduct.stock_producto + this.selectedProduct.cantidad;
      const newProductStock = this.selectedNewProduct.stock_producto - this.newProductQuantity;

      const updatedOriginalProduct = {
        id: this.selectedProduct.id_tbl_productos,
        stock_producto: originalProductStock,
      };

      const updatedNewProduct = {
        id: this.selectedNewProduct.id,
        stock_producto: newProductStock,
      };

      const updatedRegistroDetalle = {
        id: this.selectedProduct.id_tbl_registro_detalles,
        id_registro: this.selectedProduct.id_tbl_registros,
        id_producto: this.selectedNewProduct.id,
        cantidad: this.newProductQuantity,
      };

      // Update the original product's stock
      this.registerDetailsService.postEditProductos(updatedOriginalProduct).subscribe(
        () => {
          // Update the new product's stock
          this.registerDetailsService.postEditProductos(updatedNewProduct).subscribe(
            () => {
              // Update the registro detalle
              this.registerDetailsService.postEditRegistroDetalle(updatedRegistroDetalle).subscribe(
                () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Producto reemplazado exitosamente',
                  });
                  // Update UI as needed
                  this.resetForm();
                    this.loading = false;
                },
                (error) => {
                  this.loading = false;
                  console.error('Error updating Registro Detalle:', error);
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Hubo un problema al actualizar el detalle del registro',
                  });
                }
              );
            },
            (error) => {
              this.loading = false;
              console.error('Error updating new product stock:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Hubo un problema al actualizar el stock del nuevo producto',
              });
            }
          );
        },
        (error) => {
          this.loading = false;
          console.error('Error updating original product stock:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Hubo un problema al actualizar el stock del producto original',
          });
        }
      );
    } else {
      this.loading = false;
      this.messageService.add({
        severity: 'warn',
        summary: 'Advertencia',
        detail: 'Selecciona un producto y cantidad válida',
      });
    }
  }


  private resetForm() {
    this.selectedReport = undefined;
    this.trabajadoresOptions = [];
    this.selectedTrabajador = undefined;
    this.idRegistrosOptions = [];
    this.selectedIdRegistro = undefined;
    this.registroDetalles = [];
    this.selectedProduct = null;
    this.selectedNewProduct = null;
    this.newProductQuantity = 0;
  }
}
