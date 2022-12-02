import { IsMongoId, IsNotEmpty } from 'class-validator';

export default class CreateUserPermissionDto {
  @IsNotEmpty()
  @IsMongoId()
  user: string;

  @IsNotEmpty()
  @IsMongoId()
  permission: string;
}
