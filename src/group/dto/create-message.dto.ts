import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsUrl, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateGroupDto {
    @ApiProperty()
    @IsUUID()
    fromId: string
    @ApiProperty()
    @IsUUID()
    groupId: string
    @ApiProperty()
    @IsString()
    @MinLength(1)
    text: string
}
