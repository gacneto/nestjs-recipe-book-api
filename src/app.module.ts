import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { User } from './users/entities/user.entity';
import { Recipe } from './recipes/entities/recipe.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // torna o ConfigModule disponivel em toda aplicacao
      envFilePath: '.env', // especifica o nome do arquivo de config
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // importa o ConfigModule para usar o ConfigService
      inject: [ConfigService], // injeta o ConfigService para ler as variáveis de ambiente
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Recipe], 
        synchronize: true, // apenas para desenvolvimento! Cria/atualiza tabelas automaticamente
        logging: true, // mostra as queries SQL no console (bom para debug) 
      }),
    }),
    AuthModule,
    UsersModule,
    RecipesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
