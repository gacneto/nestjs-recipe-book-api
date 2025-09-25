import { Recipe } from '../../recipes/entities/recipe.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';

@Entity('users') 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true }) // torna a entrada de email unica, ou seja, nao pode ter email duplicado
  email: string;

  @Column({ select: false }) // impede que a senha seja retornada em queries por padrão
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  // relação: um usuário pode ter muitas receitas
  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];
}