import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Test } from '@nestjs/testing';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UserStubs } from '../user/user.service.spec';
import { ChangePasswordAuthDto } from './dtos/change-password-auth.dto';

export const fakeToken = (): { accessToken: string } => ({
  accessToken: 'fkklfsdflskndfhlksndflknsdfklsdn',
});

const mockAuthService = () => ({
  login: jest.fn().mockResolvedValue(fakeToken),
  changePassword: jest.fn(),
  forgetPassword: jest.fn().mockResolvedValue({ email: String }),
});

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: AuthService, useFactory: mockAuthService },
      ],
    }).compile();
    authService = await module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    describe('should  login', () => {
      const loginUserInput: LoginAuthDto = {
        email: UserStubs().email,
        password: UserStubs().password,
      };

      it('should be able to generate an access token', async () => {
        const result = await authService.login(loginUserInput);
        expect(result).toBeDefined();
        expect(result).toBe(fakeToken);
      });
    });
  });

  describe('authService changePassword', () => {
    describe('changePassword', () => {
      const changePasswordDto: ChangePasswordAuthDto = {
        password: 'dsds',
        confirmePassword: 'sdsd',
      };
      it('should ', () => {
        expect(authService.changePassword).toBeCalledWith(
          'hfhfghfg',
          changePasswordDto,
          {},
        );
      });
      beforeEach(async () => {
        await authService.changePassword('hfhfghfg', changePasswordDto, {});
      });
    });
  });

  describe('authService forgetPassword', () => {
    describe('forgetPassword', () => {
      it('should ', () => {
        expect(authService.forgetPassword).toBeCalledWith(UserStubs().email);
      });
      beforeEach(async () => {
        await authService.forgetPassword(UserStubs().email);
      });
    });
  });
});
