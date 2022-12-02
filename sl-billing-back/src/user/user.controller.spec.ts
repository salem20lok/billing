import { Test } from '@nestjs/testing';
import { UserStubs } from './user.service.spec';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUserController = () => ({
  getUserById: jest.fn().mockResolvedValue(UserStubs),
  getAllUser: jest
    .fn()
    .mockResolvedValue({ users: [UserStubs], count: Number }),
  createUser: jest.fn().mockResolvedValue(UserStubs),
  updateUser: jest.fn().mockResolvedValue(UserStubs),
  identification: jest.fn().mockResolvedValue(UserStubs),
  deleteUser: jest.fn().mockResolvedValue({ id: String }),
});

describe('UserController', () => {
  let userController: UserController;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [UserController],
      providers: [
        UserService,
        { provide: UserService, useFactory: mockUserController },
      ],
    }).compile();
    userController = await module.get<UserController>(UserController);
  });

  describe('getUserById', () => {
    describe('when getUser is Called', () => {
      let user: User;
      beforeEach(async () => {
        user = await userController.getUserById('62d9318563ac3829225e08e3');
      });

      it('then should return a user', () => {
        expect(user).toEqual(UserStubs);
      });
    });
  });

  describe('getAllUser', () => {
    describe('when getAllUser is Called ', () => {
      let result: { users: User[]; count: number };

      beforeEach(async () => {
        result = await userController.getAllUser({
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

      beforeEach(async () => {
        user = await userController.createUser(createUserDto);
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
      beforeEach(async () => {
        user = await userController.updateUser(
          '62d9318563ac3829225e08e3',
          UpdateUserDto,
          'ssd',
        );
      });
      it('then it should call UserService ', () => {
        expect(user).toEqual(UserStubs);
      });
    });
  });

  describe('identification', () => {
    describe('when identification is called', () => {
      let user;

      beforeEach(async () => {
        user = await userController.identification('62d9318563ac3829225e08e3');
      });
      it('should ', () => {
        expect(user).toEqual(UserStubs);
      });
    });
  });
});
