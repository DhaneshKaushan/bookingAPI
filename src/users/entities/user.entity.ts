import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';


export enum UserRole {

  ADMIN = 'ADMIN',

  CUSTOMER = 'CUSTOMER'

}


@Entity('users')
export class User {


  @PrimaryGeneratedColumn()
  id!:number;


  @Column()
  name!:string;


  @Column({
    unique:true
  })
  email!:string;


  @Column()
  password!:string;


  @Column({
    type:'enum',
    enum:UserRole,
    default:UserRole.CUSTOMER
  })
  role!:UserRole;


  @CreateDateColumn()
  createdAt!:Date;

}