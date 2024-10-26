import { AutocompleteConfig } from "../../../components/autocomplete/autocomple.model";
import { UserAttributes } from "../../../models/users.model";


// Configuración para usuarios
export const userComponentConfig: AutocompleteConfig<UserAttributes> = {
  labelFn: (user) => `${user.nombres} ${user.apellidos}`,
  filterFn: (query: string, users: UserAttributes[]) =>
    users.filter(user =>
      `${user.nombres} ${user.apellidos}`.toLowerCase().includes(query.toLowerCase())
    )
};
