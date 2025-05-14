import {
  IsInt,
  IsOptional,
  IsString,
  MinLength
} from "class-validator";
import { RangeListDto } from "src/common/dto/RangeList.dto";

export class GetUsersDto extends RangeListDto{
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsInt()
  age?: number;
}

export class UpdateUsersDto{
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsOptional()
  @IsInt()
  age?: number;
}

export class UserResponseDto {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  email: string;
}