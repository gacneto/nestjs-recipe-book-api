import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecipesService } from './recipes.service';
import { Recipe } from './entities/recipe.entity';
import { User } from '../users/entities/user.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

const mockRecipeRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

describe('RecipesService', () => {
  let service: RecipesService;
  let repository: Repository<Recipe>;

  // Criamos um usuário mock para os testes
  const mockUser = new User();
  mockUser.id = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRecipeRepository,
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    repository = module.get<Repository<Recipe>>(getRepositoryToken(Recipe));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a recipe if found and user is owner', async () => {
      const recipe = new Recipe();
      recipe.id = 1;
      recipe.userId = mockUser.id; // Usuário é o dono

      mockRecipeRepository.findOneBy.mockResolvedValue(recipe);

      const result = await service.findOne(1, mockUser.id);
      expect(result).toEqual(recipe);
      expect(mockRecipeRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should throw NotFoundException if recipe not found', async () => {
      mockRecipeRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(1, mockUser.id)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      const recipe = new Recipe();
      recipe.id = 1;
      recipe.userId = 2; // Outro usuário é o dono

      mockRecipeRepository.findOneBy.mockResolvedValue(recipe);

      await expect(service.findOne(1, mockUser.id)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('findAllByUserId', () => {
    it('should return an array of recipes for a user', async () => {
        const recipes = [new Recipe(), new Recipe()];
        mockRecipeRepository.find.mockResolvedValue(recipes);

        const result = await service.findAllByUserId(mockUser.id);
        expect(result).toEqual(recipes);
        expect(mockRecipeRepository.find).toHaveBeenCalledWith({ where: { userId: mockUser.id } });
    });
  });
});