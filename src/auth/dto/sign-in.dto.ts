import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'E-mail de login',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456', description: 'Senha de login' })
  @IsString()
  @IsNotEmpty()
  password: string;
}