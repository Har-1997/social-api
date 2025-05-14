import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtPublicKey } from './jwt.constatnt';
import { JwtPayloadInterface } from 'src/modules/token/jwt.interface';

// This check JWT token, check this is example jwt-sigin or not
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt-sigin') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtPublicKey,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: { sub: string, role: string }): Promise<JwtPayloadInterface> {
    // This object gets attached to request.user
    return { id: payload.sub, role: payload.role };
  }
}