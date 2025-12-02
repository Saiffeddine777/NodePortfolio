import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

export enum ProjectCategory {
    WEB="Web",
    API= "Api",
    MOBILE = "Mobile",
    OTHER = "Other"
}

@Entity({ name: "projects" })
class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: false,
  })
  projectName!: string;

  @Column({
    nullable: false,
  })
  githubUrl!: string;

  @Column({
    nullable: false,
  })
  liveUrl!: string;

  @Column({
    nullable: false,
  })
  published!: boolean;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  publicId?: string;

  @Column("text", { array: true, nullable: false })
  techStack!: string[];

  @Column({
    type: "enum",
    enum : ProjectCategory,
    default :ProjectCategory.WEB,
    nullable :false
  })
  category!: ProjectCategory;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;
}

export default Project;
