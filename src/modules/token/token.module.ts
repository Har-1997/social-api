import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { jwtPrivateKey, jwtPublicKey } from './jwt.constatnt';

@Module({
  imports: [
    JwtModule.register({
      privateKey: {
        key: jwtPrivateKey,
        passphrase: '',
      },
      publicKey: jwtPublicKey,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '1d',
      },
    }),
  ],
  providers: [JwtStrategy],
  exports: [JwtModule, JwtStrategy],
})
export class TokenModule {}