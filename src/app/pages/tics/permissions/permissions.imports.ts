import { AutocompleteConfig } from '../../../components/autocomplete/autocomple.model';
import { UserAttributes } from '../../../models/users.model';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AutocompleteComponent } from '../../../components/autocomplete/autocomplete.component';
import { TabViewModule } from 'primeng/tabview';
import { PanelAssingComponent } from './components/panel-assing/panel-assing.component';
import { PanelUpdateComponent } from './components/panel-update/panel-update.component';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
export const ModulesApp = [
  PanelAssingComponent,
  PanelUpdateComponent,
  ButtonModule,
  RippleModule,
  ProgressSpinnerModule,
  TabViewModule,
  FormsModule,
  AutocompleteComponent,
];

// Configuración para usuarios
export const userComponentConfig: AutocompleteConfig<UserAttributes> = {
  labelFn: (user) => `${user.nombres} ${user.apellidos}`,
  filterFn: (query: string, users: UserAttributes[]) =>
    users.filter((user) =>
      `${user.nombres} ${user.apellidos}`
        .toLowerCase()
        .includes(query.toLowerCase())
    ),
};
