import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map, Observable } from 'rxjs';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root',
})
export class PrintvoidService {
  private user: any = {}; // Inicializar objeto de usuario

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener la imagen de los assets como una promesa
  private loadImage(url: string): Observable<Uint8Array> {
    return this.http
      .get(url, { responseType: 'arraybuffer' })
      .pipe(map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer)));
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

  exportToPDFAnulados(data: any[], category: string): void {
    this.dataUser()
      .then(() => {
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
        this.loadImage('assets/shared/template.jpg').subscribe((imageData) => {
          const img = new Image();
          const url = URL.createObjectURL(
            new Blob([imageData], { type: 'image/jpg' })
          );
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
              if (category === 'trabajadores') {
                (doc as any).autoTable({
                  head: [ [ 'ID', 'Codigo', 'Fecha', 'Nombre', 'Producto', 'Cantidad', 'Observacion' ] ],
                  body: data
                    .slice(startIndex, startIndex + rowsPerPage)
                    .map((report) => [
                      report.id_tbl_registros,
                      report.codigo_producto,
                      report.fecha_registro,
                      report.nombre,
                      report.nombre_producto,
                      report.cantidad,
                      report.observacion,
                    ]),
                  startY: marginTop + 10,
                  margin: { top: marginTop, bottom: marginBottom },
                  didDrawPage: () => {
                    // Añadir número de página
                    doc.setFontSize(10);
                    doc.text(
                      `Página ${currentPage}`,
                      pageWidth - 30,
                      pageHeight - 10
                    );
                    currentPage++;
                  },
                  styles: {
                    font: 'Times', // Asegúrate de que la fuente se aplique aquí
                    fontSize: 10,
                  },
                });
              } else if (category === 'areas') {
                (doc as any).autoTable({
                  head: [ [ 'ID', 'Codigo', 'Fecha', 'Area', 'Producto', 'Cantidad', 'Observacion' ] ],
                  body: data
                    .slice(startIndex, startIndex + rowsPerPage)
                    .map((report) => [
                      report.id_tbl_registros_areas,
                      report.codigo_producto,
                      report.fecha_registro,
                      report.nombre_area,
                      report.nombre_producto,
                      report.cantidad,
                      report.observacion,
                    ]),
                  startY: marginTop + 10,
                  margin: { top: marginTop, bottom: marginBottom },
                  didDrawPage: () => {
                    // Añadir número de página
                    doc.setFontSize(10);
                    doc.text(
                      `Página ${currentPage}`,
                      pageWidth - 30,
                      pageHeight - 10
                    );
                    currentPage++;
                  },
                  styles: {
                    font: 'Times', // Asegúrate de que la fuente se aplique aquí
                    fontSize: 10,
                  },
                });
              } else if (category === 'vehiculos') {
                (doc as any).autoTable({
                  head: [ [ 'ID', 'Codigo', 'Fecha', 'Placa', 'Producto', 'Cantidad', 'Observacion' ] ],
                  body: data
                    .slice(startIndex, startIndex + rowsPerPage)
                    .map((report) => [
                      report.id_tbl_registros_vehiculos,
                      report.codigo_producto,
                      report.fecha_registro,
                      report.placa,
                      report.nombre_producto,
                      report.cantidad,
                      report.observacion,
                    ]),
                  startY: marginTop + 10,
                  margin: { top: marginTop, bottom: marginBottom },
                  didDrawPage: () => {
                    // Añadir número de página
                    doc.setFontSize(10);
                    doc.text(
                      `Página ${currentPage}`,
                      pageWidth - 30,
                      pageHeight - 10
                    );
                    currentPage++;
                  },
                  styles: {
                    font: 'Times', // Asegúrate de que la fuente se aplique aquí
                    fontSize: 10,
                  },
                });
              }

              if (startIndex + rowsPerPage < data.length) {
                drawPage(startIndex + rowsPerPage);
              } else {
                doc.save(
                  `Reporte_${exportDateString.replace(/[/, :]/g, '_')}.pdf`
                );
              }
            };

            drawPage(0);
          };
        });
      })
      .catch((error) => {
        console.error('Error al cargar datos del usuario:', error);
      });
  }
}
