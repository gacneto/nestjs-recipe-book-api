import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';
import { User } from '../../users/entities/user.entity';
import { UnauthorizedException } from '@nestjs/common';

// Mocks para as dependências da JwtStrategy
const mockUsersService = {
  findById: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'JWT_SECRET') {
      return 'test_secret'; // Retorna um segredo de teste
    }
    return null;
  }),
};

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UsersService, useValue: mockUsersService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should validate and return the user based on JWT payload', async () => {
      // O payload que o Passport decodifica do token
      const payload = { sub: 1, email: 'test@example.com' };
      
      const user = new User();
      user.id = 1;
      user.email = 'test@example.com';
      
      // Quando findById for chamado com o ID do payload, ele deve retornar o nosso usuário
      mockUsersService.findById.mockResolvedValue(user);

      const result = await strategy.validate(payload);

      // Verificamos se o serviço foi chamado com o ID correto
      expect(usersService.findById).toHaveBeenCalledWith(payload.sub);
      // Verificamos se a estratégia retornou o usuário encontrado
      expect(result).toEqual(user);
    });

    it('should throw an UnauthorizedException if user is not found', async () => {
      const payload = { sub: 99, email: 'ghost@example.com' };
      
      // Simulamos o caso em que o usuário não é encontrado no banco
      mockUsersService.findById.mockResolvedValue(null);

      // Verificamos se a validação rejeita a promessa com o erro correto
      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
    });
  });
});