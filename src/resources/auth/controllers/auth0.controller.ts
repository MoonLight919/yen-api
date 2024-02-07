import { UseGuards, Controller } from '@nestjs/common';
import { ApiTags, ApiExcludeController } from '@nestjs/swagger';
import { Auth0KeyAuthenticationGuard } from '../guards';

@ApiExcludeController(true)
@ApiTags('Auth')
@Controller('auth')
@UseGuards(Auth0KeyAuthenticationGuard)
export class Auth0Controller {
}
