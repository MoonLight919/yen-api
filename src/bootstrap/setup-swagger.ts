import {
  DocumentBuilder,
  type OpenAPIObject,
  SwaggerModule,
} from '@nestjs/swagger';
import { type NestFastifyApplication } from '@nestjs/platform-fastify';
import { componentSchemas } from '@modules/ajv-resolver';

export const setupSwagger = (
  app: NestFastifyApplication,
  options: { version: string; enabled: boolean },
): OpenAPIObject | void => {
  if (options.enabled) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('YEN')
      .setDescription('API description for YEN project')
      .setVersion(options.version)
      .addBearerAuth()
      .addServer('http://localhost:3000', 'local');

    const swaggerDocumentConfig = swaggerConfig.build();
    const swaggerDocument = SwaggerModule.createDocument(
      app,
      {
        ...swaggerDocumentConfig,
        components: {
          securitySchemes: swaggerDocumentConfig.components?.securitySchemes,
          schemas: Object.fromEntries(
            componentSchemas.map((schema) => [schema.$id, schema]),
          ),
        },
      },
      { deepScanRoutes: true },
    );

    SwaggerModule.setup('api/docs', app, swaggerDocument, {
      swaggerOptions: {
        filter: true,
        showExtensions: true,
        tryItOutEnabled: true,
        displayRequestDuration: true,
        requestSnippetsEnabled: true,
      },
    });

    return swaggerDocument;
  }
};
