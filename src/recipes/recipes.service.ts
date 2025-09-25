import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private readonly recipesRepository: Repository<Recipe>,
  ){}

  async create(createRecipeDto: CreateRecipeDto, user: User): Promise<Recipe>{
    const recipe = this.recipesRepository.create({
      ...createRecipeDto,
      user, // associa a receita ao usuário logado
    });
    return this.recipesRepository.save(recipe);
  }

  async findAllByUserId(userId: number): Promise<Recipe[]>{
    return this.recipesRepository.find({where: {userId}});
  }

  async findOne(id: number, userId: number): Promise<Recipe>{
    const recipe = await this.recipesRepository.findOneBy({id});

    if (!recipe) {
      throw new NotFoundException(`Receita com ID #${id} não encontrada.`);
    }
    if (recipe.userId !== userId) {
      throw new ForbiddenException('Você não tem permissão para acessar esta receita.');
    }

    return recipe;
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto, userId: number): Promise<Recipe>{
    const recipe = await this.findOne(id, userId); // verificação da permissão

    const updateRecipe = Object.assign(recipe, updateRecipeDto); // pega o primeiro param. que foi alterado e já mando para o novo 'recipe'

    return this.recipesRepository.save(updateRecipe);
  }

  async remove(id:number, userId: number): Promise<void>{
    const recipe = await this.findOne(id, userId) // verificação da permissão
    await this.recipesRepository.remove(recipe);
  }
}
