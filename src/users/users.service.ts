import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpDto } from '../auth/dto/sign-up.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ){}

    async create(signUpDto: SignUpDto): Promise<User>{
        const user = this.usersRepository.create(signUpDto);
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
    // usa o queryBuilder para incluir a senha na busca, já que ela está com { select: false } na entidade
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();
    }

    async findById(id: number): Promise<User | null> {
        return this.usersRepository.findOneBy({ id });
    }
}
