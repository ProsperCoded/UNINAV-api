import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // reflector used to access meta data
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // check if the route is public
    // * you can also use this.reflector.get<boolean>('isPublic', context.getHandler());, but getAllAndOverride would make sure methods metadata takes precedence than class meta data.
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      // GET the metadata from the handler and class
      context.getHandler(),
      context.getClass(),
    ]);
    // simply go ahead with request
    if (isPublic) return true;
    // if not public, then use the jwt guard, gotten from parent
    return super.canActivate(context);
  }
}
