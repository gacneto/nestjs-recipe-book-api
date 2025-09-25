import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { User } from '../users/entities/user.entity';

// Mock completo do RecipesService
const mockRecipesService = {
  create: jest.fn(),
  findAllByUserId: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  const mockUser = new User();
  mockUser.id = 1;

  // Mock do objeto de requisição que o Guard anexa
  const mockRequest = { user: mockUser };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      // Fornecemos o nosso mock no lugar do serviço real
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call recipesService.create with correct parameters', async () => {
      const createRecipeDto: CreateRecipeDto = {
        titulo: 'Bolo de Teste',
        descricao: 'Uma descrição',
        ingredientes: ['ingrediente 1'],
        instrucoes: ['passo 1'],
      };
      const createdRecipe = { id: 1, ...createRecipeDto, user: mockUser };

      // O mock do serviço retornará esta receita quando 'create' for chamado
      mockRecipesService.create.mockResolvedValue(createdRecipe);

      const result = await controller.create(createRecipeDto, mockRequest);

      // Verificamos se o serviço foi chamado com os argumentos corretos
      expect(service.create).toHaveBeenCalledWith(createRecipeDto, mockUser);
      // Verificamos se o controller retornou o resultado do serviço
      expect(result).toEqual(createdRecipe);
    });
  });

  describe('findAll', () => {
    it('should call recipesService.findAllByUserId with correct user id', async () => {
      const recipes = [{ id: 1, titulo: 'Receita 1' }];
      mockRecipesService.findAllByUserId.mockResolvedValue(recipes);

      const result = await controller.findAll(mockRequest);

      expect(service.findAllByUserId).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(recipes);
    });
  });

  describe('findOne', () => {
    it('should call recipesService.findOne with correct parameters', async () => {
      const recipe = { id: 1, titulo: 'Receita 1' };
      mockRecipesService.findOne.mockResolvedValue(recipe);

      const result = await controller.findOne(1, mockRequest);

      expect(service.findOne).toHaveBeenCalledWith(1, mockUser.id);
      expect(result).toEqual(recipe);
    });
  });
});