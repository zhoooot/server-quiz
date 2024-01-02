import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class ZodGuard implements CanActivate {
  constructor(private readonly schema: any) {}

  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest();

      const { body } = request;

      this.schema.parse(body);

      return true;
    } catch (error) {
      return false;
    }
  }
}
