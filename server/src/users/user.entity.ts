import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { City } from '../cities/city.entity'

@Entity({ name: 'users' })
@Unique(['name'])
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 120 })
  name!: string

  @Column({ type: 'varchar', length: 120 })
  surname!: string

  @Column({ name: 'password_hash', type: 'varchar', length: 60 })
  passwordHash!: string

  @ManyToOne(() => City, (city) => city.users, { nullable: false })
  @JoinColumn({ name: 'city_id' })
  city!: City

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date
}
