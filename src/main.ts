import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.enableCors(corsOptions);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('NextParty API')
    .setDescription('Documentation for NextParty RESTfull API')
    .setVersion('1.0')
    .addTag('App')
    .addTag('Auth')
    .addTag('Users')
    .addTag('Events')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  document.tags = [
    { name: 'Auth', description: 'Security System' },
    { name: 'Users', description: 'User System' },
    { name: 'Events', description: 'Event System' },
    { name: 'App', description: 'App Check' },
  ];

  SwaggerModule.setup('api/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      defaultModelsExpandDepth: -1,
    },
  });
  await app.listen(parseInt(process.env.PORT) || 3000);
}
bootstrap();
