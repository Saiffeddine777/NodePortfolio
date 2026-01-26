import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity({ name: "portfoliofiles" })
export class PortfolioFile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  fileName!: string;

  @Column({ nullable: false })
  publicId!: string;

  @Column({ nullable: false })
  publicUrl!: string;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt!: Date;

  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
}
