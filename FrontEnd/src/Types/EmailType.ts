export interface EmailInterface {   
    id ?:number,
    subject :string,
    body :String ,
    fromEmail:string ,
    fromName :string ,
    isRead?:boolean
    createdAt?: Date,
    updatedAt ?:Date
}