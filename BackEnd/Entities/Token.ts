import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name:"tokens"})
export class Token{
    @PrimaryGeneratedColumn("uuid")
    id!:string;
    @Column({nullable:false})
    email !: string;
    @Column({nullable :false})
    token !:string;
    @Column ({
        default : false,
        nullable : false
    })
    isUsed ! : boolean 
    @CreateDateColumn({type : "timestamp"})
    createdAt ! :Date;

}