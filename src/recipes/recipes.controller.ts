import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Recipe } from './entities/recipe.entity';

@ApiBearerAuth() // Requer token para todos os endpoints deste controller no Swagger
@ApiTags('recipes')
@UseGuards(JwtAuthGuard) // Aplica o nosso "segurança" a todas as rotas abaixo
@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova receita' })
  create(@Body() createRecipeDto: CreateRecipeDto, @Req() req): Promise<Recipe> {
    // req.user foi anexado pela JwtStrategy
    return this.recipesService.create(createRecipeDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as receitas do usuário logado' })
  findAll(@Req() req): Promise<Recipe[]> {
    return this.recipesService.findAllByUserId(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar uma receita específica por ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<Recipe> {
    return this.recipesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma receita' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @Req() req,
  ): Promise<Recipe> {
    return this.recipesService.update(id, updateRecipeDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar uma receita' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<void> {
    return this.recipesService.remove(id, req.user.id);
  }
}