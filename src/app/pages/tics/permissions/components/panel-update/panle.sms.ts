// confirm-dialog.util.ts
import { toast } from 'ngx-sonner';
import { ConfirmationService } from 'primeng/api';


export const showConfirmDialog = (
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