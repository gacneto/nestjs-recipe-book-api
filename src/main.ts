import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService); // pega o ConfigService para ler o .env

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove propriedades que não estão no DTO
      forbidNonWhitelisted: true, // lança um erro se propriedades extras forem enviadas
      transform: true, // transforma os payloads para os tipos dos DTOs
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Meu Caderno de Receitas API')
    .setDescription('Documentação da API para o app de gerenciamento de receitas.')
    .setVersion('1.0')
    .addTag('auth', 'Operações de Autenticação') // tag para agrupar endpoints de autenticação
    .addTag('recipes', 'Operações de Receitas') // tag para agrupar endpoints de receitas
    .addBearerAuth() // habilita a autorização com Bearer Token (JWT) no Swagger UI
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // acessível em http://localhost:3000/api-docs

  const port = configService.get<number>('APP_PORT') || 3000;
  await app.listen(port);

  console.log(`🚀 Aplicação rodando na porta: ${port}`);
  console.log(`📚 Documentação disponível em: http://localhost:${port}/api-docs`);
}
bootstrap();
