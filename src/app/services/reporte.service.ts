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
  private docxTemplateUrl = 'assets/formato2.0.docx'; // Ruta del documento de plantilla .docx

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



  public async RepGeneral(data: any[]): Promise<void> {
    try {
      // Obtén la información del usuario
      await this.dataUser();
  
      // Cargar el archivo .docx existente
      this.http.get(this.docxTemplateUrl, { responseType: 'arraybuffer' }).subscribe({
        next: (arrayBuffer) => {
          const zip = new PizZip(arrayBuffer);
          const doc = new Docxtemplater(zip);
  
          // Datos para agregar en el documento
          const dataToInsert = {
            supervisorname: "", // Asignar el nombre del supervisor si es necesario
            nameEntregaEPP: `${this.user.nombres} ${this.user.apellidos}`,
            fecha: new Date().toLocaleDateString('es-ES'),
            Reportes: data.length > 0 ? data.map(report => ({
              NameReceptor: report.nombre || '',
              CargoReceptor: report.cargo || '',
              Productos: report.nombre_producto || ''
            })) : [{ // Default empty object to handle no data case
              NameReceptor: '',
              CargoReceptor: '',
              Productos: ''
            }],
          };
  
          // Si solo hay un elemento en la lista, puedes asegurarte de que los otros estén vacíos en tu lógica
          if (data.length === 1) {
            dataToInsert.Reportes.push({ // Adding an empty entry to show blank rows
              NameReceptor: '',
              CargoReceptor: '',
              Productos: ''
            });
          }
  
          // Sustituir los placeholders con datos
          doc.setData(dataToInsert);
  
          try {
            doc.render();
          } catch (error) {
            console.error('Error rendering document:', error);
            return;
          }
  
          // Generar y guardar el archivo
          const output = doc.getZip().generate({ type: 'blob' });
          saveAs(output, 'reporte_general.docx');
        },
        error: (err) => {
          console.error('Error al cargar la plantilla .docx:', err);
        }
      });
    } catch (error) {
      console.error('Error al generar el reporte general:', error);
    }
  }
}  