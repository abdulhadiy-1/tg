import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString, IsUrl, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreateMessageDto {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    text: string
}
