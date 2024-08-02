import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable'; // Asegúrate de que este paquete está instalado
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PrintService {
  constructor(private http: HttpClient) {}

  // Método para obtener la imagen de los assets como una promesa
  private loadImage(url: string): Observable<Uint8Array> {
    return this.http.get(url, { responseType: 'arraybuffer' }).pipe(
      map((arrayBuffer: ArrayBuffer) => new Uint8Array(arrayBuffer))
    );
  }

  exportToPDF(data: any[]): void {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Definir márgenes
    const marginTop = 40;
    const marginBottom = 30;
    const pageHeightAdjusted = pageHeight - marginBottom;

    // Obtener la fecha y hora de exportación
    const exportDate = new Date();
    const exportDateString = exportDate.toLocaleString();

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
            head: [['ID', 'Codigo', 'Fecha', 'Nombre', 'Producto', 'Cantidad']],
            body: data.slice(startIndex, startIndex + rowsPerPage).map(report => [
              report.id,
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
             // doc.text(`Total de registros: ${data.length}`, 14, pageHeight - 10);
              currentPage++;
            }
          });

          if (startIndex + rowsPerPage < data.length) {
            drawPage(startIndex + rowsPerPage);
          } else {
            doc.save(`ReporteSG_${exportDateString.replace(/[/, :]/g, '_')}.pdf`);
          }
        };

        drawPage(0);
      };
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
}
