import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsString, maxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsMobilePhone()
  phone: string;
  @ApiProperty()
  @IsString()
  password: string;
}
