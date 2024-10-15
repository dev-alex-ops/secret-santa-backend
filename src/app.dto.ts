import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";

class RecipientDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}

class ExclusionDto {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email1: string;

    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email2: string;
}

export class AppDto {
    @IsNotEmpty()
    @IsArray()
    @IsObject({each: true})
    @ValidateNested({each: true})
    @Type(()=>RecipientDto)
    recipients: RecipientDto[]

    @IsNotEmpty()
    @IsArray()
    @IsObject({each: true})
    @ValidateNested({each: true})
    @Type(()=>ExclusionDto)
    @IsOptional()
    excludes?: ExclusionDto[]
}

