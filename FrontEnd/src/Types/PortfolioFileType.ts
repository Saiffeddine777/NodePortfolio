
export interface PortfolioFile {
    id?: number;
    fileName : string ;
    publicId?: string;
    publicUrl?: string;
    updatedAt?: Date;
    createdAt?: Date;
    file ?: File | null; 
}