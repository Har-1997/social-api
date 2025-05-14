import { Type } from "class-transformer";
import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { RangeListDto } from "src/common/dto/RangeList.dto";
import { StatusFriendEnum } from "src/common/interfaces/interfaces";

export class AddFriendDto{
  @IsNotEmpty()
  addressee_id: string;
}

export class UpdateFrinendshipDto{
  @IsIn([StatusFriendEnum.ACCEPT, StatusFriendEnum.DECLINED])
  status: StatusFriendEnum.ACCEPT | StatusFriendEnum.DECLINED;
}

export class GetFriendshipDto extends RangeListDto{
  @IsOptional()
  @Type(() => String)
  status: string = StatusFriendEnum.ACCEPT;
}

export class FriendUserDto {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  status: StatusFriendEnum.ACCEPT | StatusFriendEnum.PENDING;
}