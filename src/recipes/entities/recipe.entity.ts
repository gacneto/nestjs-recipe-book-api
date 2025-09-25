import { User } from '../../users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('recipes')
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column('text')
  descricao: string;

  @Column('text', { array: true })
  ingredientes: string[];

  @Column('text', { array: true })
  instrucoes: string[];

  @Column({ nullable: true }) // torna esse campo opcional
  tempo_preparo_min: number;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  userId: number; // coluna para a chave estrangeira

  // relação: muitas receitas pertencem a um usuário
  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' }) // especifica qual coluna guarda a relação
  user: User;
}