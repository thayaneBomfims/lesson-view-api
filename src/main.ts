import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const cors = require('cors');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Lesson View API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/docs', app, document);

  app.use(cors({
    origin: "*",
  }));
  app.enableCors(
    {
      origin: "*",
      allowedHeaders: ['Accept', 'Content-Type'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    }
  )

  await app.listen(3000);
}
bootstrap();
