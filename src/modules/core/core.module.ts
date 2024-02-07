import { Module, type OnModuleInit } from '@nestjs/common';
import addFormats from 'ajv-formats';
import addKeywords from 'ajv-keywords';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  AjvValidator,
  ValidationModule,
  JsonSchemaSerializerInterceptor,
} from 'nestjs-validation';
import {
  HttpExceptionFilter,
  GlobalExceptionFilter,
  NotFoundExceptionFilter,
  ValidationExceptionFilter,
} from './filters';
import { TracingProvider } from './providers';
import { RequestInterceptorInterceptor } from './interceptors';

@Module({
  imports: [ValidationModule.forFeature()],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: JsonSchemaSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestInterceptorInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    TracingProvider,
  ],
})
export class CoreModule implements OnModuleInit {
  constructor(private readonly ajvValidator: AjvValidator) {}

  public onModuleInit(): void {
    addFormats(this.ajvValidator.ajv, [
      'date-time',
      'time',
      'date',
      'email',
      'hostname',
      'ipv4',
      'ipv6',
      'uri',
      'uri-reference',
      'uuid',
      'uri-template',
      'json-pointer',
      'relative-json-pointer',
      'regex',
    ]);
    addKeywords(this.ajvValidator.ajv, ['transform']);
  }
}
