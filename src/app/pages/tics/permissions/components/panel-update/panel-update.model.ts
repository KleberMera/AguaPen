import { ConfirmationService } from "primeng/api";
import { lsUserPermissions } from "../../../../../models/auth.model";
import { PayloadPermissionsUpdate } from "../../../../../models/permisos.model";
import { toast } from "ngx-sonner";
import { UserAttributes } from "../../../../../models/users.model";

export const generatePermissionPayload = (
  opcion: lsUserPermissions,
  tipo: 'ver' | 'editar',
  userId: number | undefined
): PayloadPermissionsUpdate | null => {
  if (!userId) {
    console.error('No se encontró el ID del usuario');
    return null;
  }

  // Crear una copia del objeto para no mutar el original
  const updatedOpcion = { ...opcion };

  if (tipo === 'ver') {
    updatedOpcion.per_ver = updatedOpcion.per_ver === 1 ? 0 : 1;
  } else {
    updatedOpcion.per_editar = updatedOpcion.per_editar === 1 ? 0 : 1;
  }

  return {
    mutate: [
      {
        operation: 'update',
        key: updatedOpcion.permiso_id,
        attributes: {
          user_id: userId,
          opcion_id: updatedOpcion.opcion_id,
          per_editar: Boolean(updatedOpcion.per_editar),
          per_ver: Boolean(updatedOpcion.per_ver),
        },
      },
    ],
  };
};



export const handlePermissionUpdate = ( event: Event, opcion: lsUserPermissions,tipo: 'ver' | 'editar',
    userId: number | undefined,
    srvConfirm: ConfirmationService,
    updateCallback: (payload: PayloadPermissionsUpdate) => Promise<void>
  ) => {
    srvConfirm.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro de actualizar esta opción?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        const payload = generatePermissionPayload(opcion, tipo, userId);
        if (payload) {
          updateCallback(payload);
        } else {
          toast.error('Error al generar la actualización');
        }
      },
      reject: () => {
        toast.info('Operación cancelada');
      }
    });
  };
  
  export const processPermissionPayload = async (
    payload: PayloadPermissionsUpdate,
    srvPermisos: any, // Ajusta el tipo según tu servicio
    user: UserAttributes | null,
    refreshCallback: (user: UserAttributes) => Promise<void>
  ): Promise<void> => {
    try {
      const response = await srvPermisos.postEditPermisos(payload).toPromise();
      
      if (!response) {
        throw new Error('No se recibió respuesta del servidor');
      }
  
      if (response.updated) {
        toast.success('Opción actualizada correctamente');
        if (user) {
          await refreshCallback(user);
        } else {
          toast.warning('No se pudo actualizar la lista de módulos: Usuario no encontrado');
        }
      } else {
        toast.error('Error al actualizar la opción');
      }
    } catch (error) {
      console.error('Error al procesar el payload:', error);
      toast.error('Error al procesar la solicitud');
      throw error; // Re-lanzar el error para manejarlo en el componente si es necesario
    }
  };

  

  export const showConfirmDialogPanelUpdate = (
    confirmationService: ConfirmationService,
    event: Event,
    onAccept: () => Promise<void>,
    options: {
      message?: string;
      header?: string;
    } = {}
  ) => {
    confirmationService.confirm({
      target: event.target as EventTarget,
      message: options.message || '¿Estás seguro de realizar esta acción?',
      header: options.header || 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      rejectButtonStyleClass: 'p-button-text',
      accept: async () => {
        try {
          await onAccept();
        } catch (error) {
          console.error('Error:', error);
        }
      },
      reject: () => {
        toast.info('Operación cancelada');
      }
    });
  };