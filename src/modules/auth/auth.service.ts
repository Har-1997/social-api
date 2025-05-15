import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  Logger
} from '@nestjs/common';
import { MailService } from '../mail/mail.service';
import { generateTempPassword } from 'src/common/utils';
import { UsersService } from '../users/users.service';
import { jwtPrivateKey } from '../token/jwt.constatnt';
import { AccessTokenInterface } from 'src/common/interfaces/interfaces';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly usersService: UsersService,
  ) {}

  async signUpServ(first_name: string, last_name: string, age: number, email: string): Promise<string> {
    const userWithEmail = await this.usersService.getUserWithEmailServ(email);
    if( userWithEmail ){
      throw new Error('User with this email already exists!');
    }

    const password = generateTempPassword();
    const hashPass = await bcrypt.hash(password, 10);

    try {
      await this.mailService.sendMailFunc({
        email,
        mailName: 'Your Password',
        subject: "you have registered in the Social website.",
        context: {
            password: password
        }
      })
    } catch (err) {
      this.logger.error('Failed to send email:', err.message);
      throw new InternalServerErrorException('Email send failed');
    }

    await this.usersService.createUserServ(first_name, last_name, age, email, hashPass);

    return 'User created successfully';
  }

  async signInServ(email: string, password: string): Promise<AccessTokenInterface> {
    const user = await this.usersService.getUserWithEmailServ(email);
    if (!user) {
      throw new UnauthorizedException('User not found!');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid password!');
    }

    const payload = { sub: user.id, role: 'user' };

    const access_token = this.jwtService.sign(payload, {
      privateKey: jwtPrivateKey,
      algorithm: 'RS256',
      expiresIn: '1d',
    });

    return { access_token }
  }
}
