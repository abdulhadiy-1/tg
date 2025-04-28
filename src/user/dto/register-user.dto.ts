import { ApiProperty } from '@nestjs/swagger';
import {
  IsMobilePhone,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @MaxLength(30)
  @MinLength(1)
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsString()
  @MaxLength(40)
  @MinLength(1)
  userName: string;
  @ApiProperty()
  @IsUrl()
  @IsOptional()
  @ApiProperty()
  photo?: string;
  @IsMobilePhone()
  @ApiProperty()
  phone: string;
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @MinLength(5)
  password: string;
}
