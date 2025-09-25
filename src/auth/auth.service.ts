import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ){}

    async signUp(signUpDto: SignUpDto): Promise<{accessToken:string}>{
        const {email, password} = signUpDto;

        const hashedPassword = await bcrypt.hash(password, 10); // vai hashear a senha ('cripgrafa-la')

        try{
            const user = await this.usersService.create({
                ...signUpDto,
                password: hashedPassword,
            });

            const payload = {email: user.email, sub: user.id};

            const accessToken = this.jwtService.sign(payload);

            return {accessToken};
        }catch(error){
            if(error.code === '23505'){ // erro de e-mail duplicado
                throw new ConflictException('Este e-mail já está em uso.');
            }
            throw new InternalServerErrorException();
        }
    }

    async signIn(signInDto: SignInDto): Promise<{accessToken: string}>{
        const {email, password} = signInDto;

        const user = await this.usersService.findByEmail(email);

        if(!user){
            throw new UnauthorizedException('Credenciais inválidas.');
        }

        const isPasswordMatching = await bcrypt.compare(password, user.password); // compara a senha enviada com a senha hasheada no banco de dados

        if(!isPasswordMatching){
            throw new UnauthorizedException('Credenciais inválidas.');
        }

        const payload = {email: user.email, sub: user.id};

        const accessToken = this.jwtService.sign(payload);

        return{accessToken};
    }
}
