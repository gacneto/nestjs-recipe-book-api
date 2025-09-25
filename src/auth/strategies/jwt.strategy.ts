import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {

    const secret = configService.get('JWT_SECRET');

    if (!secret) {
        throw new Error('A variável de ambiente JWT_SECRET não foi definida.');
    }

    super({
      // Pega o token do cabeçalho 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Garante que tokens expirados sejam rejeitados
      ignoreExpiration: false,
      // Usa o mesmo segredo que usamos para assinar o token
      secretOrKey: secret,
    });
  }

  // Este método é chamado pelo Passport após validar o token com sucesso.
  // O 'payload' é o conteúdo decodificado do JWT.
  async validate(payload: { sub: number; email: string }) {
    // Usa o ID (sub) do token para buscar o usuário no banco.
    const user = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException('Token inválido.');
    }

    // O objeto retornado aqui será anexado ao objeto `request` (req.user)
    return user;
  }
}