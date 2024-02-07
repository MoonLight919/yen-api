import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationGuard } from '../guards';

export const AuthProtected = (): ClassDecorator & MethodDecorator =>
  applyDecorators(ApiBearerAuth(), UseGuards(AuthenticationGuard));
