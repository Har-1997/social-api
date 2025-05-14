import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Req
} from "@nestjs/common";
import { FriendsService } from "./friends.service";
import { PaginatedResponse, ReqDataType } from "src/common/interfaces/interfaces";
import { Auth } from "src/common/decorators/auth.decorator";
import { JwtPayloadInterface } from "../token/jwt.interface";
import { AddFriendDto, FriendUserDto, UpdateFrinendshipDto } from "./friends.dto";
import { RangeListDto } from "src/common/dto/RangeList.dto";

@Auth('user')
@Controller('friends')
export class FriendsController {  
  constructor(
    private readonly friendsService: FriendsService,
  ){}

  @Post()
  async addFriend(
    @Body() body: AddFriendDto,
    @Req() req: Request & { user: JwtPayloadInterface }
  ): Promise<ReqDataType>{

    const data = await this.friendsService.addFriendServ(req.user.id, body.addressee_id);
    return { message: 'Friend request created successfully.', success: true, data };
  }

  @Get()
  async listFriends(
    @Query() query: RangeListDto,
    @Req() req: Request & { user: JwtPayloadInterface }
  ): Promise<ReqDataType>{

    const data: PaginatedResponse<FriendUserDto> = await this.friendsService.listFriendsServ(req.user.id, query);
    return { message: 'Freinds fetched successfully.', success: true, data };
  }

  @Get('pending')
  async pending(
    @Query() query: RangeListDto,
    @Req() req: Request & { user: JwtPayloadInterface }
  ): Promise<ReqDataType>{
    const { skip = 0, limit = 10 } = query;

    const data: PaginatedResponse<FriendUserDto> = await this.friendsService.getFriendshipsServ(req.user.id, skip, limit);
    return { message: 'Pending friendships fetched successfully.', success: true, data };
  }

  @Get('pending_me')
  async pandingMe(
    @Query() query: RangeListDto,
    @Req() req: Request & { user: JwtPayloadInterface }
  ): Promise<ReqDataType>{
    const { skip = 0, limit = 10 } = query;

    const data: PaginatedResponse<FriendUserDto> = await this.friendsService.getFriendshipsServ(req.user.id, skip, limit, false);

    return { message: 'Pending friendships fetched successfully.', success: true,  data};
  }

  @Patch(":uuid")
  async updateFrinedship(
    @Req() req: Request & { user: JwtPayloadInterface },
    @Body() body: UpdateFrinendshipDto,
    @Param('uuid') uuid: string
  ): Promise<ReqDataType>{
    await this.friendsService.updateFrinedshipServ(req.user.id, uuid, body.status);
    return { message: 'Friendship updated successfully.', success: true };
  }

  @Delete(":uuid")
  @HttpCode(204)
  async deleteFriend(
    @Req() req: Request & { user: JwtPayloadInterface },
    @Param('uuid') uuid: string
  ): Promise<void>{
    await this.friendsService.deleteFriendServ(req.user.id, uuid);
  }
}