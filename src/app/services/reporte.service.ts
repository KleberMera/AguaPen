import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private user: any = {}; // Inicializar objeto de usuario
  private docxTemplateUrl = 'assets/formato.docx'; // Ruta del documento de plantilla .docx

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para generar el reporte
  public async reportedeAsignacion(
    selectedUser: any,
    selectedProducts: any[],
    observacion: string,
    totalCantidadProductos: number,
    idRegistro: number
  ): Promise<void> {
    try {
      // Obtén la información del usuario
      await this.dataUser();

      // Cargar el archivo .docx existente
      this.http.get(this.docxTemplateUrl, { responseType: 'arraybuffer' }).subscribe(arrayBuffer => {
        const zip = new PizZip(arrayBuffer);
        const doc = new Docxtemplater(zip);

        // Datos para agregar en el documento
        const data = {
          SupervisorName: "",
          nameEntregaEPP: `${this.user.nombres} ${this.user.apellidos}`,
          actividadPrincipal: observacion,
          fecha: new Date().toLocaleDateString('es-ES'),
          NameReceptor: selectedUser.tx_nombre,
          cargoReceptor: selectedUser.tx_cargo,
          Productos: selectedProducts.map(product => product.nombre_producto), 
          TotalCantidadProductos: totalCantidadProductos,
          IdRegistro: idRegistro,
        };

        // Sustituir los placeholders con datos
        doc.setData(data);

        try {
          doc.render();
        } catch (error) {
          console.error('Error rendering document:', error);
          return;
        }

        const output = doc.getZip().generate({ type: 'blob' });
        saveAs(output, 'reporte.docx');
      });
    } catch (error) {
      console.error('Error al generar el reporte:', error);
    }
  }

  // Método para obtener la información del usuario
  private dataUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.viewDataUser().subscribe(
        (res: any) => {
          if (res && res.data) {
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
}
