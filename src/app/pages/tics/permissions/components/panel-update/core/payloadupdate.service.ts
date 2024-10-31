import { Injectable } from '@angular/core';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { PayloadUserUpdate, UserAttributes } from '../../../../../../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class PayloadupdateService {

  constructor(private srvAuth: AuthService) {}

  private cleanUserData(user: any): Partial<UserAttributes> {
    const cleanedUser = { ...user };
    const fieldsToDelete = [
      'email_verified_at',
      'remember_token',
      'created_at',
      'updated_at'
    ];
    
    fieldsToDelete.forEach(field => delete cleanedUser[field]);
    
    return cleanedUser;
  }

  private createUpdatePayload(userData: any, newEstado: number): PayloadUserUpdate {
    return {
      mutate: [{
        operation: 'update',
        key: userData.id!,
        attributes: {
          ...userData,
          estado: newEstado
        }
      }]
    };
  }

  async updateUserStatus(user: UserAttributes): Promise<{
    success: boolean;
    updatedUser?: UserAttributes;
    error?: any;
  }> {
    try {
      const cleanedUser = this.cleanUserData(user);
      const newEstado = user.estado === 1 ? 0 : 1;
      const payload = this.createUpdatePayload(cleanedUser, newEstado);

      const response: any = await this.srvAuth.updateUser(payload).toPromise();

      if (response?.updated) {
        return {
          success: true,
          updatedUser: {
            ...cleanedUser,
            estado: newEstado
          } as UserAttributes
        };
      }

      return {
        success: false,
        error: 'No se pudo actualizar el usuario'
      };
    } catch (error) {
      return {
        success: false,
        error
      };
    }
  }
}
