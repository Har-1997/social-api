import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Query,
  Req
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { PaginatedResponse, ReqDataType } from "src/common/interfaces/interfaces";
import { GetUsersDto, UpdateUsersDto, UserResponseDto } from "./users.dto";
import { JwtPayloadInterface } from "../token/jwt.interface";
import { Auth } from "src/common/decorators/auth.decorator";

@Auth('user')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ){}

  @Get()
  async getUsers(
    @Query() query: GetUsersDto,
    @Req() req: Request & { user: JwtPayloadInterface }
  ): Promise<ReqDataType>{

    const data: PaginatedResponse<UserResponseDto> = await this.usersService.getUsersServ(req.user.id, query);
    return { message: 'User created successfully', success: true, data };
  }

  @Patch()
  @HttpCode(204)
  async updateUser(
    @Body() body: UpdateUsersDto,
    @Req() req: Request & { user: JwtPayloadInterface },
  ){
    await this.usersService.updateMeServ(req.user.id, body);
  }

  @Delete()
  @HttpCode(204)
  async deleteUser(
    @Req() req: Request & { user: JwtPayloadInterface },
  ){
    await this.usersService.deleteMeServ(req.user.id);
  }

  @Get(":uuid")
  async getUser(
    @Param('uuid') uuid: string
  ): Promise<ReqDataType>{
    const data = await this.usersService.getUserServ(uuid);

    return { message: 'User fetched successfully.', success: true, data };
  }
}