import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de que este paquete está instalado
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  private user: any = {}; // Inicializar objeto de usuario

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener la imagen de los assets como una promesa
  private loadImage(url: string): Observable<Uint8Array> {
    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
    );
  }

  // Método para obtener datos del usuario y devolver una promesa
  private dataUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.viewDataUser().subscribe(
        (res: any) => {
          if (res) {
            this.user = res.data;
            resolve(this.user);
          } else {
            console.error('No se pudo obtener la información del usuario.');
            reject('Información del usuario no disponible.');
          }
        },
        (error) => {
          console.error('Error al obtener la información del usuario:', error);
          reject('Error al obtener la información del usuario.');
        }
      );
    });
  }

  exportToPDF(data: any[]): void {
    this.dataUser().then(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Definir márgenes
      const marginTop = 40;
      const marginBottom = 30;

      // Obtener la fecha y hora de exportación
      const exportDate = new Date();
      const exportDateString = exportDate.toLocaleString();

      // Establecer la fuente a "Times"
      doc.setFont('Times', 'normal');

      // Cargar la imagen de fondo
      this.loadImage('assets/fondo.webp').subscribe((imageData) => {
        const img = new Image();
        const url = URL.createObjectURL(new Blob([imageData], { type: 'image/webp' }));
        img.src = url;

        img.onload = () => {
          let currentPage = 1;

          const addBackgroundAndDate = () => {
            doc.addImage(img, 'WEBP', 0, 0, pageWidth, pageHeight); 
            doc.setFontSize(8);
            doc.text(` ${exportDateString}`, 14, marginTop - 0);
          };

          const rowsPerPage = 25;

          const drawPage = (startIndex: number) => {
            if (startIndex >= data.length) return;

            if (currentPage > 1) {
              doc.addPage();
            }

            addBackgroundAndDate();

            // Uso de autoTable para agregar la tabla
            (doc as any).autoTable({
              head: [['ID', 'Codigo', 'Fecha', 'Nombre', 'Producto', 'Cantidad', 'Firma']],
              body: data.slice(startIndex, startIndex + rowsPerPage).map(report => [
                report.id_tbl_registros,
                report.codigo_producto,
                report.fecha_registro,
                report.nombre,
                report.nombre_producto,
                report.cantidad
              ]),
              startY: marginTop + 10, 
              margin: { top: marginTop, bottom: marginBottom },
              didDrawPage: () => {
                // Añadir número de página
                doc.setFontSize(10);
                doc.text(`Página ${currentPage}`, pageWidth - 30, pageHeight - 10);
                currentPage++;
              },
              styles: {
                font: 'Times', // Asegúrate de que la fuente se aplique aquí
                fontSize: 10,
              }
            });

            if (startIndex + rowsPerPage < data.length) {
              drawPage(startIndex + rowsPerPage);
            } else {
              doc.save(`Reporte_${exportDateString.replace(/[/, :]/g, '_')}.pdf`);
            }
          };

          drawPage(0);
        };
      });
    }).catch((error) => {
      console.error('Error al cargar datos del usuario:', error);
    });
  }



  printElement(elementId: string): void {
    const printContents = document.getElementById(elementId)?.innerHTML;
    if (printContents) {
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    } else {
      console.error(`Elemento no encontrado: ${elementId}`);
    }
  }

  exportAsignacion(selectedUser: any, selectedProducts: any[], observacion: string, totalCantidadProductos: number, idRegistro: number,selectedFile: File | null): void {
    this.dataUser().then(() => {
      // Asegúrate de que la información del usuario está disponible antes de generar el PDF
      if (!this.user.nombres || !this.user.cedula) {
        console.error('Información del usuario no disponible.');
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Definir márgenes
      const marginTop = 40;
      const marginBottom = 50; // Aumentado para dejar espacio para la firma

      // Obtener la fecha y hora de exportación
      const exportDate = new Date();
      const exportDateString = exportDate.toLocaleString();

      // Establecer la fuente a "Times"
      doc.setFont('Times', 'normal');

      // Cargar la imagen de fondo
      this.loadImage('assets/fondo.webp').subscribe((imageData) => {
        const img = new Image();
        const url = URL.createObjectURL(new Blob([imageData], { type: 'image/webp' }));
        img.src = url;

        img.onload = () => {
          let currentPage = 1;

          const addBackgroundAndDate = () => {
            doc.addImage(img, 'WEBP', 0, 0, pageWidth, pageHeight);
            doc.setFontSize(8);
            doc.text(` ${exportDateString}`, 14, marginTop - 0);
          };

          const rowsPerPage = 25;

          const drawPage = (startIndex: number) => {
            if (startIndex >= selectedProducts.length) return;

            if (currentPage > 1) {
              doc.addPage();
            }

            addBackgroundAndDate();

            // Título de la tabla centrado
            doc.setFontSize(12);
            const title = 'Reporte De Asignaciones a Empleados (Registro N°' + idRegistro + ')';
            const titleWidth = doc.getTextWidth(title);
            const titleX = (pageWidth - titleWidth) / 2;
            doc.text(title, titleX, marginTop + 5);

            // Uso de autoTable para agregar la tabla
            (doc as any).autoTable({
              head: [['Codigo', 'Producto', 'Cantidad']],
              body: selectedProducts.slice(startIndex, startIndex + rowsPerPage).map(product => [
                product.codigo_producto,
                product.nombre_producto,
                product.cantidad
              ]).concat([
                // Add a row for the total only if this is the last page
                ...(startIndex + rowsPerPage >= selectedProducts.length ? [[null, 'Total', totalCantidadProductos]] : [])
              ]),
              startY: marginTop + 10,
              margin: { top: marginTop, bottom: marginBottom },
              styles: {
                font: 'Times', // Asegúrate de que la fuente se aplique aquí
                fontSize: 10,
                cellPadding: 2,
                halign: 'center', // Centrar horizontalmente todo el contenido
              },
              columnStyles: {
                1: { halign: 'center' }, // Centrar la columna 'Nombre'
                2: { halign: 'center' }, // Centrar la columna 'Cantidad'
              },
              didDrawPage: () => {
                // Añadir número de página
                doc.setFontSize(10);
                doc.text(`Página ${currentPage}`, pageWidth - 30, pageHeight - 10);
                currentPage++;
              }
            });

            if (startIndex + rowsPerPage < selectedProducts.length) {
              drawPage(startIndex + rowsPerPage);
            } else {
              // Añadir resumen de usuario en la primera página
              const lastPageY = doc.internal.pageSize.height - marginBottom + 20;
              doc.setFontSize(10);
              doc.text(`Observacion: ${observacion}`, 14, lastPageY - 30);
              // Información del usuario que inició sesión (lado izquierdo)
              const leftMargin = 14;
              doc.text('_________________', leftMargin, lastPageY - 10);
              doc.text('Firma', leftMargin, lastPageY - 5);
              doc.text(`${this.user.nombres}  ${this.user.apellidos}`, leftMargin, lastPageY);
              doc.text(`CI: ${this.user.cedula}`, leftMargin, lastPageY + 5);

              // Información del usuario seleccionado (lado derecho)
              const rightMargin = pageWidth - 75; // Ajusta según sea necesario
              doc.text('_________________', rightMargin, lastPageY - 10);
              doc.text('Firma', rightMargin, lastPageY - 5);
              doc.text(`${selectedUser.tx_nombre}`, rightMargin, lastPageY);
              doc.text(`CI: ${selectedUser.tx_cedula}`, rightMargin, lastPageY + 5);

              // Añadir imagen seleccionada si está disponible
            if (selectedFile) {
              const fileReader = new FileReader();
              fileReader.onload = (e: any) => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                  const imageWidth = 100; // Ajusta el tamaño de la imagen si es necesario
                  const imageHeight = (imageWidth / img.width) * img.height;
                  doc.addImage(img, 'PNG', 55, lastPageY -160, imageWidth, imageHeight);
                  doc.save(`Asignacion_${exportDateString.replace(/[/, :]/g, '_')}.pdf`);
                };
              };
              fileReader.readAsDataURL(selectedFile);
            } else {
              doc.save(`Asignacion_${exportDateString.replace(/[/, :]/g, '_')}.pdf`);
            }
          }
        };


          drawPage(0);
        };
      });
    }).catch((error) => {
      console.error('Error al cargar datos del usuario:', error);
    });
    
  }










  exportAsigVehicle(selectedVehiculo: any, selectedProducts: any[], observacion: string, totalCantidadProductos: number): void {
    this.dataUser().then(() => {
      if (!this.user.nombres || !this.user.cedula) {
        console.error('Información del usuario no disponible.');
        return;
      }
  
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
  
      const marginTop = 40;
      const marginBottom = 50;
  
      const exportDate = new Date();
      const exportDateString = exportDate.toLocaleString();
  
      doc.setFont('Times', 'normal');
  
      this.loadImage('assets/fondo.webp').subscribe((imageData) => {
        const img = new Image();
        const url = URL.createObjectURL(new Blob([imageData], { type: 'image/webp' }));
        img.src = url;
  
        img.onload = () => {
          let currentPage = 1;
  
          const addBackgroundAndDate = () => {
            doc.addImage(img, 'WEBP', 0, 0, pageWidth, pageHeight);
            doc.setFontSize(8);
            doc.text(` ${exportDateString}`, 14, marginTop - 0);
          };
  
          const rowsPerPage = 25;
  
          const drawPage = (startIndex: number) => {
            if (startIndex >= selectedProducts.length) return;
  
            if (currentPage > 1) {
              doc.addPage();
            }
  
            addBackgroundAndDate();
  
            if (currentPage === 1) {
              doc.setFontSize(12);
              doc.text('Datos del Vehículo:', 14, marginTop + 10);
              doc.setFontSize(10);
              doc.text(`Placa: ${selectedVehiculo.placa}`, 14, marginTop + 15);
              doc.text(`Tipo: ${selectedVehiculo.tipo}`, 14, marginTop + 20);
              doc.text(`Descripción: ${selectedVehiculo.descripcion}`, 14, marginTop + 25);
            }
  
            doc.setFontSize(12);
            const title = 'Productos';
            const titleWidth = doc.getTextWidth(title);
            const titleX = (pageWidth - titleWidth) / 2;
            doc.text(title, titleX, marginTop + 35);
  
            (doc as any).autoTable({
              head: [['Codigo', 'Nombre', 'Cantidad']],
              body: selectedProducts.slice(startIndex, startIndex + rowsPerPage).map(product => [
                product.codigo_producto,
                product.nombre_producto,
                product.cantidad
              ]).concat([
                // Add a row for the total only if this is the last page
                ...(startIndex + rowsPerPage >= selectedProducts.length ? [[null, 'Total', totalCantidadProductos]] : [])
              ]),

              startY: marginTop + 40,
              margin: { top: marginTop, bottom: marginBottom },
              styles: {
                font: 'Times',
                fontSize: 10,
                cellPadding: 2,
                halign: 'center',
              },
              columnStyles: {
                1: { halign: 'center' },
                2: { halign: 'center' },
              },
              didDrawPage: () => {
                doc.setFontSize(10);
                doc.text(`Página ${currentPage}`, pageWidth - 30, pageHeight - 10);
                currentPage++;
              }
            });
  
            if (startIndex + rowsPerPage < selectedProducts.length) {
              drawPage(startIndex + rowsPerPage);
            } else {
              const lastPageY = doc.internal.pageSize.height - marginBottom + 20;
              doc.setFontSize(10);
              doc.text(`Observacion: ${observacion}`, 14, lastPageY - 30);
              const leftMargin = 14;
              doc.text('_________________', leftMargin, lastPageY - 10);
              doc.text('Firma', leftMargin, lastPageY - 5);
              doc.text(`${this.user.nombres}  ${this.user.apellidos}`, leftMargin, lastPageY);
              doc.text(`CI: ${this.user.cedula}`, leftMargin, lastPageY + 5);
  
              const rightMargin = pageWidth - 75;
              doc.text('_________________', rightMargin, lastPageY - 10);
              doc.text('Firma Receptor', rightMargin, lastPageY - 5);
  
              doc.save(`Asignacion_${exportDateString.replace(/[/, :]/g, '_')}.pdf`);
            }
          };
  
          drawPage(0);
        };
      });
    }).catch((error) => {
      console.error('Error al cargar datos del usuario:', error);
    });
  }









  exportAsigAreas(selectedArea: any, selectedProducts: any[], observacion: string, totalCantidadProductos: number): void {
  
    this.dataUser().then(() => {
      if (!this.user.nombres || !this.user.cedula) {
        console.error('Información del usuario no disponible.');
        return;
      }
  
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
  
      const marginTop = 40;
      const marginBottom = 50;
  
      const exportDate = new Date();
      const exportDateString = exportDate.toLocaleString();
  
      doc.setFont('Times', 'normal');
  
      this.loadImage('assets/fondo.webp').subscribe((imageData) => {
        const img = new Image();
        const url = URL.createObjectURL(new Blob([imageData], { type: 'image/webp' }));
        img.src = url;
  
        img.onload = () => {
          let currentPage = 1;
  
          const addBackgroundAndDate = () => {
            doc.addImage(img, 'WEBP', 0, 0, pageWidth, pageHeight);
            doc.setFontSize(8);
            doc.text(` ${exportDateString}`, 14, marginTop - 0);
          };
  
          const rowsPerPage = 25;
  
          const drawPage = (startIndex: number) => {
            if (startIndex >= selectedProducts.length) return;
  
            if (currentPage > 1) {
              doc.addPage();
            }
  
            addBackgroundAndDate();
  
            if (currentPage === 1) {
              doc.setFontSize(12);
              doc.setFontSize(10);
              doc.text(` Area: ${selectedArea.nombre_area}`, 14, marginTop + 15);
            }
  
            doc.setFontSize(12);
            const title = 'Productos';
            const titleWidth = doc.getTextWidth(title);
            const titleX = (pageWidth - titleWidth) / 2;
            doc.text(title, titleX, marginTop + 20);
  
            // Add the table with an additional row for totals
            const autoTableOptions = {
              head: [['Codigo', 'Nombre', 'Cantidad']],
              body: selectedProducts.slice(startIndex, startIndex + rowsPerPage).map(product => [
                product.codigo_producto,
                product.nombre_producto,
                product.cantidad
              ]).concat([
                // Add a row for the total only if this is the last page
                ...(startIndex + rowsPerPage >= selectedProducts.length ? [[null, 'Total', totalCantidadProductos]] : [])
              ]),
              startY: marginTop + 25,
              margin: { top: marginTop, bottom: marginBottom },
              styles: {
                font: 'Times',
                fontSize: 10,
                cellPadding: 2,
                halign: 'center',
              },
              columnStyles: {
                1: { halign: 'center' },
                2: { halign: 'center' },
              },
              didDrawPage: () => {
                doc.setFontSize(10);
                doc.text(`Página ${currentPage}`, pageWidth - 30, pageHeight - 10);
                currentPage++;
              }
            };
  
            (doc as any).autoTable(autoTableOptions);
  
            if (startIndex + rowsPerPage < selectedProducts.length) {
              drawPage(startIndex + rowsPerPage);
            } else {
              const lastPageY = doc.internal.pageSize.height - marginBottom + 20;
              doc.setFontSize(10);
              doc.text(`Observacion: ${observacion}`, 14, lastPageY - 30);
              const leftMargin = 14;
              doc.text('_________________', leftMargin, lastPageY - 10);
              doc.text('Firma', leftMargin, lastPageY - 5);
              doc.text(`${this.user.nombres}  ${this.user.apellidos}`, leftMargin, lastPageY);
              doc.text(`CI: ${this.user.cedula}`, leftMargin, lastPageY + 5);
  
              const rightMargin = pageWidth - 75;
              doc.text('_________________', rightMargin, lastPageY - 10);
              doc.text('Firma Receptor', rightMargin, lastPageY - 5);
  
              doc.save(`Asignacion_${exportDateString.replace(/[/, :]/g, '_')}.pdf`);
            }
          };
  
          drawPage(0);
        };
      });
    }).catch((error) => {
      console.error('Error al cargar datos del usuario:', error);
    });
  }
  

  









  exportToPDFVEHICULO(data: any[]): void {
    this.dataUser().then(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Definir márgenes
      const marginTop = 40;
      const marginBottom = 30;

      // Obtener la fecha y hora de exportación
      const exportDate = new Date();
      const exportDateString = exportDate.toLocaleString();

      // Establecer la fuente a "Times"
      doc.setFont('Times', 'normal');

      // Cargar la imagen de fondo
      this.loadImage('assets/fondo.webp').subscribe((imageData) => {
        const img = new Image();
        const url = URL.createObjectURL(new Blob([imageData], { type: 'image/webp' }));
        img.src = url;

        img.onload = () => {
          let currentPage = 1;

          const addBackgroundAndDate = () => {
            doc.addImage(img, 'WEBP', 0, 0, pageWidth, pageHeight); 
            doc.setFontSize(8);
            doc.text(` ${exportDateString}`, 14, marginTop - 0);
          };

          const rowsPerPage = 25;

          const drawPage = (startIndex: number) => {
            if (startIndex >= data.length) return;

            if (currentPage > 1) {
              doc.addPage();
            }

            addBackgroundAndDate();
            
            // Uso de autoTable para agregar la tabla
            (doc as any).autoTable({
              
              head: [['ID', 'Fecha', 'Placa', 'Producto', 'Cantidad','Observacion','Firma']],
              body: data.slice(startIndex, startIndex + rowsPerPage).map(report => [
                report.id_tbl_registros_vehiculos,
              
                report.fecha_registro,
                report.placa,
                report.nombre_producto,
                report.cantidad,
                report.observacion
              ]),
              startY: marginTop + 10, 
              margin: { top: marginTop, bottom: marginBottom },
              didDrawPage: () => {
                // Añadir número de página
                doc.setFontSize(10);
                doc.text(`Página ${currentPage}`, pageWidth - 30, pageHeight - 10);
                currentPage++;
              },
              styles: {
                font: 'Times', // Asegúrate de que la fuente se aplique aquí
                fontSize: 10,
              }
            });

            if (startIndex + rowsPerPage < data.length) {
              drawPage(startIndex + rowsPerPage);
            } else {
              doc.save(`Reporte_${exportDateString.replace(/[/, :]/g, '_')}.pdf`);
            }
          };

          drawPage(0);
        };
      });
    }).catch((error) => {
      console.error('Error al cargar datos del usuario:', error);
    });
  }









  exportToPDFAREA(data: any[]): void {
    this.dataUser().then(() => {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Definir márgenes
      const marginTop = 40;
      const marginBottom = 30;

      // Obtener la fecha y hora de exportación
      const exportDate = new Date();
      const exportDateString = exportDate.toLocaleString();

      // Establecer la fuente a "Times"
      doc.setFont('Times', 'normal');

      // Cargar la imagen de fondo
      this.loadImage('assets/fondo.webp').subscribe((imageData) => {
        const img = new Image();
        const url = URL.createObjectURL(new Blob([imageData], { type: 'image/webp' }));
        img.src = url;

        img.onload = () => {
          let currentPage = 1;

          const addBackgroundAndDate = () => {
            doc.addImage(img, 'WEBP', 0, 0, pageWidth, pageHeight); 
            doc.setFontSize(8);
            doc.text(` ${exportDateString}`, 14, marginTop - 0);
          };

          const rowsPerPage = 25;

          const drawPage = (startIndex: number) => {
            if (startIndex >= data.length) return;

            if (currentPage > 1) {
              doc.addPage();
            }

            addBackgroundAndDate();

            // Uso de autoTable para agregar la tabla
            (doc as any).autoTable({
              head: [['ID', 'Fecha', 'Area', 'Producto', 'Cantidad','Observacion','Firma']],
              body: data.slice(startIndex, startIndex + rowsPerPage).map(report => [
                report.id_tbl_registros_areas,
                report.fecha_registro,
                report.nombre_area,
                report.nombre_producto,
                report.cantidad,
                report.observacion
              ]),
              startY: marginTop + 10, 
              margin: { top: marginTop, bottom: marginBottom },
              didDrawPage: () => {
                // Añadir número de página
                doc.setFontSize(10);
                doc.text(`Página ${currentPage}`, pageWidth - 30, pageHeight - 10);
                currentPage++;
              },
              styles: {
                font: 'Times', // Asegúrate de que la fuente se aplique aquí
                fontSize: 10,
              }
            });

            if (startIndex + rowsPerPage < data.length) {
              drawPage(startIndex + rowsPerPage);
            } else {
              doc.save(`Reporte_${exportDateString.replace(/[/, :]/g, '_')}.pdf`);
            }
          };

          drawPage(0);
        };
      });
    }).catch((error) => {
      console.error('Error al cargar datos del usuario:', error);
    });
  }
}
