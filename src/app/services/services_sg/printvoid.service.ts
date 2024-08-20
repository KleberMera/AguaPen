import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';
import jsPDF from 'jspdf';
import { CountreportsService } from './countreports.service';


@Injectable({
  providedIn: 'root',
})
export class PrintvoidService {
  private http = inject(HttpClient);
  private srvCounReports = inject(CountreportsService);

  // Método para obtener la imagen de los assets como una promesa
  private loadImage(url: string): Observable<Uint8Array> {
    return this.http
      .get(url, { responseType: 'arraybuffer' })
      .pipe(map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer)));
  }

  exportToPDFAnulados(data: any[], category: string): void {
    if (data.length === 0) {
      console.error('No hay datos para exportar.');
      return;
    } else {
          // Paso 1: Obtener el contador actual de la categoría seleccionada
    this.srvCounReports.listCountReports().subscribe((response) => {
      // Acceder al primer objeto en el array de datos
      const reportCount = response.data[0];


      let reportNumber: number = 0;  // Inicializar como tipo número

      // Paso 2: Incrementar el contador según la categoría
      if (category === 'trabajadores') {
        reportCount.trabajadores_anulados++;
        reportNumber = reportCount.trabajadores_anulados;
      } else if (category === 'areas') {
        reportCount.areas_anuladas++;
        reportNumber = reportCount.areas_anuladas;
      } else if (category === 'vehiculos') {
        reportCount.vehiculos_anulados++;
        reportNumber = reportCount.vehiculos_anulados;
      }

      // Paso 3: Actualizar el título del PDF con el número de reporte incrementado
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
      this.loadImage('assets/shared/template.webp').subscribe((imageData) => {
        const img = new Image();
        const url = URL.createObjectURL(
          new Blob([imageData], { type: 'image/webp' })
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
            const tableHead = {
              trabajadores: ['N°', 'Codigo', 'Fecha', 'Nombre', 'Producto', 'Cantidad', 'Observacion'],
              areas: ['N°', 'Codigo', 'Fecha', 'Area', 'Producto', 'Cantidad', 'Observacion'],
              vehiculos: ['N°', 'Codigo', 'Fecha', 'Placa', 'Producto', 'Cantidad', 'Observacion'],
            }[category];
    
            const tableBody = data.slice(startIndex, startIndex + rowsPerPage).map((report) => [
              report.id_tbl_registros || report.id_tbl_registros_areas || report.id_tbl_registros_vehiculos,
              report.codigo_producto,
              report.fecha_registro,
              category === 'trabajadores' ? report.nombre : category === 'areas' ? report.nombre_area : report.placa,
              report.nombre_producto,
              report.cantidad,
              report.observacion,
            ]);

            // Título de la tabla centrado
            doc.setFontSize(12);
            // Poner la primera letra en mayúscula
            const titleReport = category.charAt(0).toUpperCase() + category.slice(1);
            const title = `Reporte Anulados de ${titleReport}`;
            const titleWidth = doc.getTextWidth(title);
            const titleX = (pageWidth - titleWidth) / 2;
            doc.text(title, titleX, marginTop + 5);
    
            (doc as any).autoTable({
              head: [tableHead],
              body: tableBody,
              startY: 50,
              margin: { top: 40, bottom: 30 },
              didDrawPage: () => doc.text(`Página ${currentPage - 1}`, pageWidth - 30, pageHeight - 10),
              styles: { font: 'Times', fontSize: 10 },
            });

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

      // Paso 4: Actualizar el contador en el servidor
      this.srvCounReports.updateCountReports(reportCount).subscribe(() => {
      
      });
    });
    }
  }
}
