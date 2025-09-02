export enum TechType {
    FRONTEND = "Frontend",
    BACKEND = "Backend",
    INFRASTRUCTURE = "Infrastructure", 
    DATABASE ="Database",
    TOOLS = "Tools",
    LANGUAGE = "Language"
}

export interface  Technology {
    [key:string] : unknown, 
    id ?:number ;
    name :string;
    logoUrl ?: string ;
    technologyType:TechType ;
    score : number;
    publicId?: string ;
    createdAt? : Date;
    updatedAt ?: Date;
    file?: File |null 

}

export type ArrayOfRendableTechnologies= Array<{text:string , techs : Technology[]}>