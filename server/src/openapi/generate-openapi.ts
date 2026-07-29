import './codegen-env'

import { dirname, join } from 'node:path'
import { writeFile } from 'node:fs/promises'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { configureApp } from '../bootstrap'
import { buildOpenApiDocument } from './document'

const PACKAGE_ROOT = dirname(require.resolve('../../package.json'))

async function main(): Promise<void> {
  const app = await NestFactory.create(AppModule, { logger: false })
  configureApp(app)
  await app.init()

  const outPath = join(PACKAGE_ROOT, 'openapi.json')
  await writeFile(outPath, `${JSON.stringify(buildOpenApiDocument(app), null, 2)}\n`, 'utf8')

  await app.close()
}

void main()
