import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock do UsersService e JwtService
const mockUsersService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

// Mock da biblioteca bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));


describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token for valid credentials', async () => {
      const user = { id: 1, email: 'test@example.com', password: 'hashedPassword' };
      mockUsersService.findByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('accessToken');

      const result = await service.signIn({ email: 'test@example.com', password: 'password' });

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual({ accessToken: 'accessToken' });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      
      await expect(service.signIn({ email: 'wrong@example.com', password: 'password' })).rejects.toThrow(UnauthorizedException);
    });
  });
    
  describe('signUp', () => {
    it('should create a user and return an access token', async () => {
        const signUpDto = { name: 'New User', email: 'new@example.com', password: 'password' };
        const user = { id: 1, ...signUpDto };

        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        mockUsersService.create.mockResolvedValue(user);
        mockJwtService.sign.mockReturnValue('accessToken');

        const result = await service.signUp(signUpDto);

        expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
        expect(usersService.create).toHaveBeenCalled();
        expect(result).toEqual({ accessToken: 'accessToken' });
    });

    it('should throw ConflictException if email already exists', async () => {
        const signUpDto = { name: 'New User', email: 'new@example.com', password: 'password' };
        
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        // Simula o erro de chave duplicada do banco de dados
        mockUsersService.create.mockRejectedValue({ code: '23505' });

        await expect(service.signUp(signUpDto)).rejects.toThrow(ConflictException);
    });
  });
});