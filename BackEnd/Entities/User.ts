import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
  ADMIN = "Admin",
  VISITOR = "Visitor",
}

@Entity({name : "users"})
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userName!: string;

  @Column({
    nullable: false,
  })
  email!: string;

  @Column({
    nullable: false,
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
    type: "enum",
    enum: UserRole,
    default: UserRole.VISITOR,
  })
  role!: UserRole;
}
