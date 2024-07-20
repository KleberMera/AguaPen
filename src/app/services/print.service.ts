import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() {}

  exportToPDF(elementId: string, fileName: string): void {
    const data = document.getElementById(elementId);
    if (data) {
      html2canvas(data).then((canvas) => {
        const imgWidth = 208;
        const pageHeight = 295;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        const heightLeft = imgHeight;

        const contentDataURL = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const position = 0;
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save(`${fileName}.pdf`);
      });
    } else {
      console.error(`Elemento no encontrado: ${elementId}`);
    }
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
