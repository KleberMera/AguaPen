import { PrintService } from '../../../services/seguridad-industrial/print.service';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { RegisterDetailsService } from '../../../services/seguridad-industrial/register-details.service';
import { ListService } from '../../../services/seguridad-industrial/list.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { formatDate } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';

import { FormsModule } from '@angular/forms';
import { Registro } from '../../../models/registers.model';
import { Product } from '../../../models/products.model';
import { ViewChild } from '@angular/core';

import { PRIMEMG_MODULES } from './registros.imports';
import { User } from '../../../models/users.model';
import { details } from '../../../models/details.model';
import { UploadimageService } from '../../../services/seguridad-industrial/uploadimage.service';
import { ReporteService } from '../../../services/seguridad-industrial/reporte.service';
import { DropdownComponent } from '../../../components/data/dropdown/dropdown.component';

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [PRIMEMG_MODULES, FormsModule, DropdownComponent],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss',
  providers: [MessageService, ConfirmationService],
})
export default class RegistrosComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  //users: User[] = [];
  protected users = signal<User[]>([]);
  protected product = signal<Product[]>([]);
  protected selectedUser = signal<User | null>(null);
  protected isInProgress = signal<boolean>(false);

  filteredUsers: User[] = [];
  searchQuery: string = '';

  showProductsTable: boolean = false;
  selectedProducts: Product[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  observacion: string = '';
  loadingMessage: string = '';
  grid: boolean = false;
  visible: boolean = false;

  selectedFile: File | null = null;

  imagePreview: string | ArrayBuffer | null = null;
  idregistro: number = 0;

  private readonly srvRegDet = inject(RegisterDetailsService);
  private readonly srvList = inject(ListService);
  private readonly PrintService = inject(PrintService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly uploadService = inject(UploadimageService);

  ngOnInit() {
    this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading = true;
    this.loadingMessage = 'Cargando Data'
    try {
      const response = await this.srvList.getListUsuarios().toPromise();
      if (response.data) {
        const data = response.data.filter((user: any) => user.dt_status === 1);
        this.users.set(data);
        const res = await this.srvList.getlistProducts().toPromise();
        if (res.data) {
          const data = res.data
            .filter(
              (product: Product) =>
                product.estado_producto === 1 && product.stock_producto > 0
            )
            .map((product: Product) => ({ ...product, cantidad: 1 }));
          this.product.set(data);
          this.loading = false;
        }
      }
    } catch (error) {
      //this.showError('Error al cargar usuarios');
      this.loading = false;
    }
  }

  handleUserSelected(user: User): void {
    this.selectedUser.set(user);
    this.messageService.add({
      severity: 'info',
      summary: 'Usuario seleccionado',
      detail: `Has seleccionado a ${user.tx_nombre}`,
    });
  }

  toggleProducts(): void {
    if (this.showProductsTable) {
      this.showProductsTable = false;
      this.isInProgress.set(false);
    } else {
      this.showProductsTable = true;
      this.isInProgress.set(true);
    }
  }

  get totalCantidadProductos(): number {
    return this.selectedProducts.reduce(
      (total, product) => total + product.cantidad,
      0
    );
  }

  updateProductQuantity(product: Product, increment: boolean): void {
    const newQuantity = increment ? product.cantidad + 1 : product.cantidad - 1;

    if (newQuantity <= product.stock_producto && newQuantity > 0) {
      product.cantidad = newQuantity;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: increment
          ? 'No puedes agregar más de la cantidad en stock'
          : 'La cantidad no puede ser menor a 1',
      });
    }
  }

  addProduct(producto: Product): void {
    const foundProduct = this.selectedProducts.find(
      (p) => p.id === producto.id
    );

    if (foundProduct) {
      foundProduct.cantidad! += producto.cantidad!;
    } else {
      this.selectedProducts.push({ ...producto, cantidad: producto.cantidad });
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${producto.nombre_producto} agregado con éxito`,
    });
  }

  async register(): Promise<void> {
    if (!this.selectedUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: 'Debe seleccionar un usuario antes de registrar',
      });
      return;
    }

    if (!this.selectedProducts.length) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: 'Debe agregar al menos un producto para registrar',
      });
      return;
    }

    await this.MsjAntRegist();
  }

  async guardarDetallesRegistro(): Promise<void> {
    try {
      const res: any = await this.srvRegDet.getidlasregistro().toPromise();
      this.idregistro = res.id_registro;

      const lastRegistroId = res.id_registro;
      const detallesRegistro: details[] = this.selectedProducts.map((prod) => ({
        id_registro: lastRegistroId,
        id_producto: prod.id,
        cantidad: prod.cantidad!,
      }));

      // Registrar todos los detalles del registro
      await Promise.all(
        detallesRegistro.map((detalle) =>
          this.srvRegDet.postRegisterRegistroDetalle(detalle).toPromise()
        )
      );

      // Actualizar el stock de los productos
      await this.actualizarStockProductos();
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al registrar los detalles',
      });
    }
  }

  revertProduct(product: Product): void {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
      product.cantidad = 0;
    }
  }

  async clearForm(): Promise<void> {
    //this.selectedUser() = null
    this.selectedProducts = [];
    this.showProductsTable = false;
    this.product().forEach((product) => (product.cantidad = 1));
    this.observacion = '';

    this.idregistro = 0;
  }

  isProductSelected(product: Product): boolean {
    return this.selectedProducts.some((p) => p.id === product.id);
  }

  increment(product: Product) {
    if (product.cantidad < product.stock_producto) {
      product.cantidad++;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No puedes agregar más de la cantidad en stock',
      });
    }
  }

  decrement(product: Product) {
    if (product.cantidad > 1) {
      product.cantidad--;
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'La cantidad no puede ser menor a 1',
      });
    }
  }

  filterProducts(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.product().filter(
      (product) =>
        product.nombre_producto.toLowerCase().includes(lowerQuery) ||
        product.codigo_producto.toLowerCase().includes(lowerQuery)
    );
  }

  async actualizarStockProductos(): Promise<void> {
    try {
      const updateRequests = this.selectedProducts.map((prod) => {
        const newStock = prod.stock_producto - prod.cantidad!;
        return this.srvRegDet
          .postEditProductos({
            id: prod.id,
            nombre_producto: prod.nombre_producto,
            fecha_producto: prod.fecha_producto,
            hora_producto: prod.hora_producto,
            stock_producto: newStock,
          })
          .toPromise();
      });

      await Promise.all(updateRequests);
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al actualizar el stock de los productos',
      });
    }
  }

  async exportData() {
    this.messageService.add({
      severity: 'info',
      summary: 'Generando reporte',
      detail: 'Espere un momento mientras se genera el reporte',
    });
    this.PrintService.exportAsignacion(
      this.selectedUser,
      this.selectedProducts,
      this.observacion,
      this.totalCantidadProductos,
      this.idregistro,
      this.selectedFile
    );
  }

  /*private async procederConRegistro(): Promise<void> {
    if (!this.selectedUser) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error de registro',
        detail: 'No hay usuario seleccionado para el registro.',
      });
      return;
    }

    this.loading = true;
    this.loadingMessage = 'Registrando Datos, espere un momento...';

    try {
      const permisos = JSON.parse(localStorage.getItem('user') || '[]');
      // Asegúrate de que selectedUser no sea null antes de acceder a sus propiedades
     const registro: Registro = {
        //id_usuario: this.selectedUser(), // Aquí `id_usuario` está asegurado de no ser `null`
        id_user_registro: permisos.id,
        fecha_registro: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'),
        hora_registro: formatDate(new Date(), 'HH:mm', 'en-US'),
        observacion: this.observacion,
        estado_registro: 1,
      };

      const res: any = await this.srvRegDet
        .postRegisterRegistro(registro)
        .toPromise();

      if (res) {
        await this.guardarDetallesRegistro();

        this.messageService.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Se registraron los detalles con éxito',
        });
        await this.getListProductos();
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error de registro',
          detail: res.mensaje || 'Error al registrar el usuario',
        });
      }
    } catch (error) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al realizar el registro',
      });
    } finally {
      this.loading = false;
    }
  }*/

  async MsjAntRegist() {
    this.confirmationService.confirm({
      message: '¿Deseas registrar esta asignación?',
      header: 'Confirmación de Registro',
      icon: 'pi pi-exclamation-triangle',
      accept: async () => {
        //        await this.procederConRegistro();

        this.exportData();
        await this.onUpload();
        this.clearForm();
      },
      reject: () => {
        this.confirmationService.close();
      },
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.files[0]; // PrimeNG returns files array
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      // Clear the preview if no file is selected
      this.imagePreview = null;
    }
  }

  async onUpload() {
    if (this.selectedFile) {
      try {
        // Esperar a obtener el id del último registro
        const res: any = await this.srvRegDet.getidlasregistro().toPromise();
        const lastRegistroId = res.id_registro;

        // Esperar a que se resuelva la promesa y obtén el observable
        const observable = await this.uploadService.uploadImage(
          lastRegistroId,
          this.selectedFile
        );

        // Ahora puedes suscribirte al observable
        observable.subscribe(
          (response: any) => {
            //  console.log('Imagen subida correctamente:', response);
          },
          (error: any) => {
            console.error('Error al subir la imagen:', error);
          }
        );
      } catch (error) {
        console.error('Error durante el proceso de subida:', error);
      }
    }
  }
}
