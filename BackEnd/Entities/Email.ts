import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn ,CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import { User } from "./User";
import { Ticket } from "./Ticket";

 
@Entity({name :"emails"})
 
export class Email {
    @PrimaryGeneratedColumn()
    id !:number;
    
    @Column ({
        nullable :false,
    })
    subject !:string;

    @Column ({
        nullable : false
    })
    body !:string ;

    @Column ({name :"from_email" , length :320 , nullable :false})
    @Index()
    fromEmail!:string ;

    @Column ({name: "from_name" , length :320 , nullable: true})
    fromName !:string ;
    
    @ManyToOne(()=>User ,(user)=>user.emails )
    @JoinColumn({name : "userId"})
    user !:User;
    
    @Column ({default: false})
    isRead !:boolean

    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({type : "timestamp"})
    updatedAt !:Date;

    @ManyToOne(()=>Ticket , (ticket)=>ticket.emails , {
        onDelete :"CASCADE",
        nullable :true
    })
    @JoinColumn({name:"ticketId"})
    ticket! :Ticket
}