import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { SignUpDto } from '../auth/dto/sign-up.dto';

// 1. Criamos um objeto mock para a estrutura do QueryBuilder
const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  getOne: jest.fn(),
};

// 2. O mock do repositório apenas cria a função createQueryBuilder
const mockUserRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  createQueryBuilder: jest.fn(), // Deixamos em branco aqui
};


describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    // Garante que todos os mocks sejam resetados antes de cada teste
    jest.clearAllMocks();
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const signUpDto: SignUpDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const user = new User();
      
      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      const result = await service.create(signUpDto);

      expect(mockUserRepository.create).toHaveBeenCalledWith(signUpDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email using query builder', async () => {
      const email = 'test@example.com';
      const user = new User();
      user.id = 1;
      user.email = email;
      
      // Quando 'getOne' for chamado, ele deve resolver com nosso objeto 'user'
      (mockQueryBuilder.getOne as jest.Mock).mockResolvedValue(user);

      // Quando 'createQueryBuilder' for chamado, ele deve retornar nosso mockQueryBuilder configurado
      (mockUserRepository.createQueryBuilder as jest.Mock).mockReturnValue(mockQueryBuilder);

      // Agora, quando o service rodar, a cadeia de chamadas funcionará como esperado
      const result = await service.findByEmail(email);

      // Verificações
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email });
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith('user.password');
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
      
      // O teste principal que estava falhando
      expect(result).toEqual(user);
    });
  });
});