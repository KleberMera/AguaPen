import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { IconFieldModule } from 'primeng/iconfield';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { BlockUIModule } from 'primeng/blockui';
import { SpinnerModule } from 'primeng/spinner';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FileUploadModule } from 'primeng/fileupload';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { AutocompleteConfig } from '../../../components/autocomplete/autocomple.model';
import { Worker } from '../../../models/workers.model';
export const  PRIMEMG_MODULES = [

  TableModule,
  ButtonModule,
  ConfirmDialogModule,
  InputIconModule,
  InputTextModule,
  ToastModule,
  AutoCompleteModule,
  IconFieldModule,
  DropdownModule,
  CardModule,
  BlockUIModule,
  SpinnerModule,
  ProgressSpinnerModule,
  InputGroupModule,
  InputGroupAddonModule,
  ScrollPanelModule,
  FileUploadModule,
  DialogModule,
];



// Configuración para usuarios
export const userComponentConfigWorker: AutocompleteConfig<Worker> = {
  labelFn: (user) => user.tx_nombre,
  filterFn: (query: string, users: Worker[]) =>
    users.filter(user =>
      user.tx_nombre.toLowerCase().includes(query.toLowerCase())
    )
};
