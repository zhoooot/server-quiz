import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { config } from '../configs/jwt.config';
import { jwtDtoSchema } from './dtos/jwt.dto';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;

    if (!authorization) {
      throw new BadRequestException('Missing token');
    }

    const [bearer, token] = authorization.split(' ');

    // console.log(bearer, token);

    if (bearer !== 'Bearer') {
      throw new BadRequestException('Invalid token');
    }

    try {
      const payload = jwt.verify(token, config.jwtPublicKey, {
        algorithms: ['RS256'],
      });

      // Validate payload
      const { exp, iat, ...rest } = jwtDtoSchema.parse(payload);

      if (exp - iat < 0) {
        throw new BadRequestException('Invalid exp');
      }

      const today = new Date();

      if (exp < today.getTime()) {
        throw new BadRequestException('Token expired');
      }

      const { sub, email, role } = rest;

      request.user = {
        auth_id: sub,
        email,
        role,
      };
      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
