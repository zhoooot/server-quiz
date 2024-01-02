import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { config } from '../configs/jwt.config';
import { jwtDtoSchema } from './dtos/jwt.dto';

@Injectable()
export class JwtGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
      throw new BadRequestException('Invalid token');
    }

    try {
      const payload = jwt.verify(token, config.jwtSecret);

      // Validate payload
      const { exp, iat, ...rest } = jwtDtoSchema.parse(payload);

      if (exp - iat < 0) {
        throw new BadRequestException('Invalid token');
      }

      const today = new Date();

      if (exp < today.getTime()) {
        throw new BadRequestException('Invalid token');
      }

      const { sub, email, role } = rest;

      request.user = {
        auth_id: sub,
        email,
        role,
      };

      return true;
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
}
