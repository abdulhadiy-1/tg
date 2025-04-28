import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator"

export class CreateGroupDto {
    @ApiProperty()
    @IsString()
    @MaxLength(30)
    @MinLength(1)
    name: string
    @ApiProperty()
    @IsString()
    @MaxLength(40)
    @MinLength(1)
    groupName: string
    @IsUrl()
    @IsOptional()
    @ApiProperty()
    photo?: string
}
