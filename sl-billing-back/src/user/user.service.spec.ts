import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

export const UserStubs = (): User => ({
  email: 'salemlokmani99@gmail.com',
  password: 'Salem-12',
  role: 'admin',
  firstName: 'salem',
  lastName: 'lokmani',
  forgetPasswordToken: '',
  avatar: '',
});

const mockUserService = () => ({
  getUserById: jest.fn().mockResolvedValue(UserStubs),
  getAllUser: jest
    .fn()
    .mockResolvedValue({ users: [UserStubs], count: Number }),
  createUser: jest.fn().mockResolvedValue(UserStubs),
  updateUser: jest.fn().mockResolvedValue(UserStubs),
  deleteUser: jest.fn().mockResolvedValue({ id: String }),
  getUserByEmail: jest.fn().mockResolvedValue(UserStubs),
  changePassword: jest.fn().mockResolvedValue({ id: String, password: String }),
  identification: jest.fn().mockResolvedValue(UserStubs),
  addForgetPasswordToken: jest
    .fn()
    .mockResolvedValue({ id: String, token: String }),
});

describe('UserService', () => {
  let userService: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        UserService,
        { provide: UserService, useFactory: mockUserService },
      ],
    }).compile();
    userService = await module.get<UserService>(UserService);
  });

  describe('getUserById', () => {
    describe('when getUser is Called', () => {
      let user: User;

      it('then it should call userService ', () => {
        expect(userService.getUserById).toBeCalledWith(
          '62d9318563ac3829225e08e3',
        );
      });

      beforeEach(async () => {
        user = await userService.getUserById('62d9318563ac3829225e08e3');
      });

      it('then should return a user', () => {
        expect(user).toEqual(UserStubs);
      });
    });
  });

  describe('getAllUser', () => {
    describe('when getAllUser is Called ', () => {
      let result: { users: User[]; count: number };

      it('then it should userService ', () => {
        expect(userService.getAllUser).toBeCalledWith({ skip: 0, limit: 0 });
      });

      beforeEach(async () => {
        result = await userService.getAllUser({
          skip: 0,
          limit: 0,
          firstName: '',
        });
      });

      it('then it should return this users', () => {
        expect(result).toEqual({ users: [UserStubs], count: Number });
      });
    });
  });

  describe('createUser', () => {
    describe('when createUser is called', () => {
      let user: User;
      const createUserDto: CreateUserDto = {
        password: UserStubs().password,
        email: UserStubs().email,
        role: UserStubs().role,
        firstName: UserStubs().firstName,
        lastName: UserStubs().lastName,
      };

      it('then it should call UserService ', () => {
        expect(userService.createUser).toHaveBeenCalledTimes(1);
        expect(userService.createUser).toBeCalledWith(createUserDto);
      });

      beforeEach(async () => {
        try {
          user = await userService.createUser(createUserDto);
        } catch (e) {
          expect(e).toBeInstanceOf(UnauthorizedException);
        }
      });

      it('then it should return a user', () => {
        expect(user).toEqual(UserStubs);
      });
    });
  });

  describe('updateUser', () => {
    describe('when updateUser is called', () => {
      let user: User;
      const UpdateUserDto: UpdateUserDto = {
        password: 'test-12',
        firstName: 'test',
        lastName: 'test',
        role: 'admin',
        email: 'test@gmail.com',
        avatar: '',
        teamsAdd: [],
        teamsDelete: [],
      };

      it('then it should call UserService', () => {
        expect(userService.updateUser).toHaveBeenCalledWith(
          '62d9318563ac3829225e08e3',
          UpdateUserDto,
        );
      });

      beforeEach(async () => {
        user = await userService.updateUser(
          '62d9318563ac3829225e08e3',
          UpdateUserDto,
          'sdsd',
        );
      });

      it('then it should call UserService ', () => {
        expect(user).toEqual(UserStubs);
      });
    });
  });

  describe('getUserByEmail', () => {
    describe('when getUserByEmail is called', () => {
      let user: User;

      it('then it should call userService ', () => {
        expect(userService.getUserByEmail).toBeCalledWith(UserStubs().email);
      });

      beforeEach(async () => {
        user = await userService.getUserByEmail(UserStubs().email);
      });

      it('then should return a user', () => {
        expect(user).toEqual(UserStubs);
      });
    });
  });

  describe('changePassword', () => {
    describe('when changePassword is called', () => {
      it('then it should call UserService', () => {
        expect(userService.changePassword).toHaveBeenCalledWith(
          '62d9318563ac3829225e08e3',
          UserStubs().password,
        );
      });

      beforeEach(async () => {
        await userService.changePassword(
          '62d9318563ac3829225e08e3',
          UserStubs().password,
        );
      });
    });
  });

  describe('identification', () => {
    describe('when identification is called', () => {
      let user;

      it('then it should call UserService', () => {
        expect(userService.identification).toHaveBeenCalledWith(
          '62d9318563ac3829225e08e3',
        );
      });

      beforeEach(async () => {
        user = await userService.identification('62d9318563ac3829225e08e3');
      });
      it('should ', () => {
        expect(user).toEqual(UserStubs);
      });
    });
  });
  describe('deleteUser', () => {
    describe('when DeleteUser is called', () => {
      it('then it should call UserService', () => {
        expect(userService.deleteUser).toBeCalledWith(
          '62d9318563ac3829225e08e3',
        );
      });

      beforeEach(async () => {
        try {
          await userService.deleteUser('62d9318563ac3829225e08e3');
        } catch (e) {
          expect(e).toBeInstanceOf(NotFoundException);
        }
      });
    });
  });

  describe('addForgetPasswordToken', () => {
    describe('when addForgetPasswordToken is called', () => {
      it('should ', () => {
        expect(userService.addForgetPasswordToken).toBeCalledWith(
          '62d9318563ac3829225e08e3',
          'token',
        );
      });
      beforeEach(async () => {
        try {
          await userService.addForgetPasswordToken(
            '62d9318563ac3829225e08e3',
            'token',
          );
        } catch (e) {
          expect(e).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
});
