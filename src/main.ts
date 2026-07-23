import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Shop API')
  .setVersion('1.0')
  .addTag('shop')
  .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  if(process.env.NODE_ENV !== 'production') {
    SwaggerModule.setup('api', app, documentFactory);
  }
  

  app.use(cookieParser.default());
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.APP_PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error(err);
});
