import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger'

export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Users by City API')
    .setVersion('1.0.0')
    .addBearerAuth()
    .addServer('/api')
    .build()

  return SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: true })
}
