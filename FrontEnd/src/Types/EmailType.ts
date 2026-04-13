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


export type Email = {
  id: number;
  subject: string;
  body: string;
  fromEmail: string;
  fromName: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Ticket = {
  // ...existing fields
  emails: Email[];
};