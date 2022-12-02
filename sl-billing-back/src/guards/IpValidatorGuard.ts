import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IpValidatorGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const allowedIp4 = new RegExp(this.configService.get('IP4_validator'));
    const allowedIp6 = new RegExp(this.configService.get('IP6_validator'));

    const Ip =
      req.headers['X-Forwarded-For'] || req.connection.remoteAddress || req.ip;

    if (!allowedIp4.test(Ip) && !allowedIp6.test(Ip)) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
