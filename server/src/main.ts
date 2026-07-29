import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import { configureApp } from './bootstrap'
import { buildOpenApiDocument } from './openapi/document'
import { env } from './config/env'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  configureApp(app)

  const document = buildOpenApiDocument(app)
  SwaggerModule.setup('api/docs', app, document, { jsonDocumentUrl: 'api/docs-json' })

  await app.listen(env.API_PORT, '0.0.0.0')
}

void bootstrap()
