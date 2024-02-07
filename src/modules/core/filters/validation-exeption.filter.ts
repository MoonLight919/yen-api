import {
  Catch,
  type ExceptionFilter,
  type ArgumentsHost,
} from '@nestjs/common';
import { type FastifyRequest, type FastifyReply } from 'fastify';
import {
  AjvValidator,
  ValidationException as NativeValidationException,
} from 'nestjs-validation';
import { ValidationHttpException } from '@lib/exceptions/validation/http';

/* TODO Replace with native ajv type when `nestjs-validation` lib will provide it */
interface AjvError {
  instancePath: string;
  schemaPath: string;
  keyword: string;
  params: Record<string, string>;
  message?: string;
}

interface ValidationErrorResult {
  name: string;
  keyword: string;
  message: string;
}

@Catch(NativeValidationException)
export class ValidationExceptionFilter
  implements ExceptionFilter<NativeValidationException>
{
  constructor(private readonly ajvValidator: AjvValidator) {}
  catch(exception: NativeValidationException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();
    const validationException = new ValidationHttpException(
      this.ajvValidator.ajv.errorsText(exception.errors),
    );

    res.status(validationException.status).send({
      ...validationException,
      request_id: req.id,
      message: validationException.message,
      errors: this.transformAjvErrors(exception.errors),
    });
  }

  private transformAjvErrors(errors: AjvError[]): ValidationErrorResult[] {
    return errors.map((ajvError) => {
      if (ajvError.keyword === 'required') {
        return this.transformRequiredError(ajvError);
      }
      if (ajvError.keyword === 'type') {
        return this.transformTypeError(ajvError);
      }
      return {
        keyword: 'unknown',
        name: this.transformInstancePath(ajvError.instancePath),
        message: ajvError.message ?? 'Unknown error',
      };
    });
  }

  private transformRequiredError(error: AjvError): ValidationErrorResult {
    return {
      keyword: 'required',
      name: error.params.missingProperty,
      message:
        error.message ?? `Must have '${error.params.missingProperty}' property`,
    };
  }

  private transformTypeError(error: AjvError): ValidationErrorResult {
    return {
      keyword: 'invalid_type',
      name: this.transformInstancePath(error.instancePath),
      message: error.message ?? 'Invalid type',
    };
  }

  private transformInstancePath(instancePath: string): string {
    return instancePath.split('/').slice(1).join('.');
  }
}
