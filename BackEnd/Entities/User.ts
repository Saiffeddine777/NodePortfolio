import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from "typeorm";
import { Email } from "./Email";

export enum UserRole {
  ADMIN = "Admin",
  VISITOR = "Visitor",
}

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userName!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    nullable: false,
    unique: true,
  })
  phoneNumber!: string;

  @Column({
    nullable: false,
  })
  password!: string;

  @Column({
    nullable: false,
  })
  occupation!: string;

  @Column({
    nullable: false,
  })
  firstName!: string;

  @Column({
    nullable: false,
  })
  lastName!: string;

  @Column({
    nullable: true,
  })
  publicId!: string;

  @Column({
    nullable: true,
  })
  imageUrl!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.VISITOR,
  })
  role!: UserRole;

  @OneToMany(()=>Email , (email)=>email.user)
  emails !:Email[]
  
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
