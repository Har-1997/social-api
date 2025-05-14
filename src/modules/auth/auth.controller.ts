import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./auth.dto";
import { AccessTokenInterface, ReqDataType } from "src/common/interfaces/interfaces";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ){}

  @Post("sign_up")
  @HttpCode(201)
  async signUp(
    @Body() body: SignUpDto
  ): Promise<ReqDataType> {
    const { first_name, last_name, age, email } = body;

    const message = await this.authService.signUpServ(first_name, last_name, age, email);

    return { message, success: true };
  }

  @Post("sign_in")
  async signIn(
    @Body() body: SignInDto
  ){
    console.log()
    const { email, password } = body;

    const data: AccessTokenInterface = await this.authService.signInServ(email, password);
    return { message: 'User created successfully', success: true, data};
  }
}