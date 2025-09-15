import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn ,CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

 
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
    body !:String ;

    @Column ({name :"from_email" , length :320 , nullable :false})
    @Index()
    fromEmail!:string ;

    @Column ({name: "from_name" , length :320 , nullable: true})
    fromName !:string ;
    @ManyToOne(()=>User ,(user)=>user.emails )
    user !:User;
    
    @Column ({default: false})
    isRead !:boolean

    
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;

    @UpdateDateColumn({type : "timestamp"})
    updatedAt !:Date;
    

}