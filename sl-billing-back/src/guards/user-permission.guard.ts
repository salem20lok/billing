import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserPermissionService } from '../user-permission/user-permission.service';
import { PermissionService } from '../permission/permission.service';
import { RoleEnum } from '../@types/role.enum';

@Injectable()
export class PermissionValidatorGuard implements CanActivate {
  constructor(
    private userPermissionService: UserPermissionService,
    private permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    const body = req.body;
    const param = req.query;

    if (user.role === RoleEnum.User) throw new ForbiddenException();

    if (user.role === RoleEnum.Admin) {
      await this.permissionService
        .getPermissionByNameAndManagement(
          body.name || param.name,
          body.management || param.management,
        )
        .then(async (res) => {
          // permission
          if (res === null) throw new ForbiddenException();
          await this.userPermissionService
            .controlledUserPermission(user._id, res._id)
            .then((result) => {
              // user-permission
              if (result === null) throw new ForbiddenException();
            })
            .catch((e) => {
              throw new ForbiddenException();
            });
        })
        .catch((e) => {
          throw new ForbiddenException();
        });
    }
    return true;
  }
}
