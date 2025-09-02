import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum TechType {
  FRONTEND = "Frontend",
  BACKEND = "Backend",
  INFRASTRUCTURE = "Infrastructure",
  DATABASE = "Database",
  TOOLS = "Tools",
  LANGUAGE = "Language",
}

@Entity({ name: "technologies" })
export class Technology {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  name!: string;

  @Column({
    nullable: true,
  })
  logoUrl!: string;

  @Column({
    type: "enum",
    enum: TechType,
    nullable: false,
  })
  technologyType!: TechType;

  @Column ("double precision",{
    nullable : false
  })
  score!:number;

  @Column({
    nullable: true,
  })
  publicId!: string;

  @UpdateDateColumn({type : "timestamp"})
  updatedAt !: Date;
  
  @CreateDateColumn({type: "timestamp"})
  createdAt !:Date;
}
