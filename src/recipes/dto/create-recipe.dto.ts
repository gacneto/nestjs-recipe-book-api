import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateRecipeDto {
  @ApiProperty({ example: 'Bolo de Cenoura', description: 'O título da receita' })
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @ApiProperty({ description: 'Uma breve descrição da receita' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({
    type: [String],
    description: 'Lista de ingredientes, cada um como um item do array',
  })
  @IsArray()
  @IsString({ each: true })
  ingredientes: string[];

  @ApiProperty({
    type: [String],
    description: 'Passo a passo do modo de preparo',
  })
  @IsArray()
  @IsString({ each: true })
  instrucoes: string[];

  @ApiProperty({
    example: 45,
    description: 'Tempo de preparo em minutos (opcional)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  tempo_preparo_min?: number;
}