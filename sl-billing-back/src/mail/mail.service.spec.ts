import { MailService } from './mail.service';
import { Test } from '@nestjs/testing';
import { UserStubs } from '../user/user.service.spec';
import { NotFoundException } from '@nestjs/common';

const emailForget = {
  email: 'salemlokmani99@gmail.com',
  name: 'salem',
  link: 'dsdslknsklnlds',
};

const sendMailMock = () => ({
  forgetPassword: jest.fn().mockResolvedValue(emailForget),
});

describe('MailService', () => {
  let mailService: MailService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [],
      providers: [
        MailService,
        { provide: MailService, useFactory: sendMailMock },
      ],
    }).compile();
    mailService = await module.get<MailService>(MailService);
  });

  describe('send email vailde forgetPassword', () => {
    it('should ', async () => {
      const result = await mailService.forgetPassword(
        UserStubs().email,
        UserStubs().firstName,
        'link',
      );
      expect(result).toBeTruthy();
    });
  });

  describe('send email vailde forgetPassword', () => {
    it('should ', async () => {
      jest.spyOn(mailService, 'forgetPassword').mockResolvedValue(null);
      try {
        await mailService.forgetPassword(null, null, null);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
