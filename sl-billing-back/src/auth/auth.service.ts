import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { MailService } from '../mail/mail.service';
import { ChangePasswordAuthDto } from './dtos/change-password-auth.dto';
import { JwtPayloadForget } from './interfaces/jwt-payload-forget.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
  ) {}

  async login(loginAuth: LoginAuthDto): Promise<{ accessToken: string }> {
    const { email, password } = loginAuth;
    const found = await this.userService.getUserByEmail(email);
    if (found && (await bcrypt.compare(password, found.password))) {
      const payload: JwtPayload = { email: email, id: found.id };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken: accessToken };
    } else {
      throw new UnauthorizedException(`please check your login correct`);
    }
  }

  async forgetPassword(email: string): Promise<void> {
    const found = await this.userService.getUserByEmail(email);
    if (!found)
      throw new BadRequestException(`this email : ${email} not Exist`);
    const payload: JwtPayloadForget = {
      firstName: found.firstName,
      lastName: found.lastName,
      email: found.email,
    };
    const accessToken: string = this.jwtService.sign(payload, {
      expiresIn: Number.parseInt(this.configService.get('JWT_EXPIRATION_TIME')),
    });

    const link = `${this.configService.get(
      'APP_BASE_URL',
    )}/change-password?token=${accessToken}`;

    await this.mailService
      .forgetPassword(found.email, found.firstName + ' ' + found.lastName, link)
      .then(async () => {
        await this.userService.addForgetPasswordToken(found._id, accessToken);
      });
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordAuthDto,
    req,
  ): Promise<void> {
    const { password, confirmePassword } = changePasswordDto;

    const found = await this.userService.getUserById(id);
    if (!found) throw new BadRequestException();

    if (!(password === confirmePassword))
      throw new BadRequestException('confirmed password is not true');

    if (found.forgetPasswordToken !== req.headers.authorization.slice(7))
      throw new UnauthorizedException();

    try {
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(password, salt);
      await this.userService.changePassword(id, hash);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
