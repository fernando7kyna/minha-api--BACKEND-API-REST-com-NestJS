import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import mongoose from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  mongoose.connection.on('connected', () => {
    console.log('✅ MongoDB conectado com sucesso!');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Erro na conexão com MongoDB:', err);
  });

  await app.listen(3000, () => {
    console.log('🚀 Servidor rodando na porta 3000');
  });
}
bootstrap();
