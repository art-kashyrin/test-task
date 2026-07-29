import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm'
import { User } from '../users/user.entity'

@Entity({ name: 'cities' })
@Unique(['name', 'state'])
export class City {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 120 })
  name!: string

  @Column({ type: 'char', length: 2 })
  state!: string

  @OneToMany(() => User, (user) => user.city)
  users!: User[]
}
