import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:4200', // Angular local dev
    'https://fundacioneran-frontend.onrender.com', // tu frontend en producción
  ];

  app.enableCors({
    origin: allowedOrigins, // reemplaza por tu URL real
    credentials: true, // si usas cookies o autenticación con credenciales
  });

  // ✅ Aplica validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // Elimina propiedades no definidas en el DTO
      forbidNonWhitelisted: true,  // Lanza error si se envía algo no permitido
      transform: true,             // Convierte tipos automáticamente
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Fundacion Eran API')
    .setDescription('Documentacion sobre el sistema de la fundación eran')
    .setVersion('1.0')
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
