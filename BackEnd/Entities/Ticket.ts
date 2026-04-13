import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";
import { Email } from "./Email";



@Entity({name:"tickets"})
export class Ticket{
    @PrimaryGeneratedColumn("uuid")
    id !:string;

    @Column({unique :true})
    jiraID !: string

    @Column({ unique: true })
    issueKey!: string;

    @Column()
    issueUrl!: string;
    
    @Column()
    summary !:string;
    
    @Column({type:"text" , nullable: true})
    description ! :string ;
   
    @Column()
    status!:string 
   
    @Column()
    issueType !:string
    
    @Column()
    projectKey!:string 
    
    @Column({ nullable: true })
    priority?:string
    
    @Column({ nullable: true })
    assigneeName !:string
    
    @ManyToOne(()=>User , (user)=>user.tickets)
    user !: User;

    @CreateDateColumn({type:"timestamp"})
    createdAt ! :Date;
    
    @UpdateDateColumn({type :"timestamp"})
    updatedAt ! :Date;

    @OneToMany(()=>Email , (email)=>email.ticket)
    emails!: Email[]

}


