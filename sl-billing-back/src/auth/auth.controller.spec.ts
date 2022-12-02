import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UserStubs } from '../user/user.service.spec';
import { fakeToken } from './auth.service.spec';

const mockAuthService = () => ({
  login: jest.fn().mockResolvedValue(fakeToken),
});

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: AuthService, useFactory: mockAuthService },
      ],
    }).compile();
    authService = await module.get<AuthService>(AuthService);
    authController = await module.get<AuthController>(AuthController);
  });

  describe('login', () => {
    describe('should  login', () => {
      let result;
      let res;

      const loginDto: LoginAuthDto = {
        email: UserStubs().email,
        password: UserStubs().password,
      };
      it('should ', () => {
        expect(authService.login).toBeCalledWith(loginDto);
      });

      beforeEach(async () => {
        res = await authService.login(loginDto);
        result = await authController.login(loginDto);
      });

      it('test login controller', () => {
        expect(res).toEqual(fakeToken);
        expect(res).toEqual(result);
      });
    });
  });
});
