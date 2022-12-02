import { Command, Option, Positional } from 'nestjs-command';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user.service';

@Injectable()
export class UserCommand {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  @Command({
    command: 'createSuperAdmin:email <email>',
    describe: 'create a createSuperAdmin',
  })
  async create(
    @Positional({
      name: 'email',
      describe: 'the email',
      type: 'string',
    })
    email: string,
    @Option({
      name: 'firstName',
      describe: 'the firstName',
      type: 'string',
      required: true,
    })
    firstName: string,
    @Option({
      name: 'lastName',
      describe: 'the lastName',
      type: 'string',
      required: true,
    })
    lastName: string,
    @Option({
      name: 'password',
      describe: 'the password',
      type: 'string',
      required: true,
    })
    password: string,
    @Option({
      name: 'confirmePassword',
      describe: 'the confirmePassword',
      type: 'string',
      required: false,
    })
    confirmePassword: string,
  ) {
    await this.userService.addSuperAdmin({
      email,
      firstName,
      lastName,
      password,
      confirmePassword,
    });
  }
}
