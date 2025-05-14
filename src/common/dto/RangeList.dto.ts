import { Type } from "class-transformer";
import { IsNumberString, IsOptional } from "class-validator";

export class RangeListDto{
  @IsNumberString()
  @IsOptional()
  @Type(() => Number)
  skip?: number;

  @IsNumberString()
  @IsOptional()
  @Type(() => Number)
  limit?: number;
}