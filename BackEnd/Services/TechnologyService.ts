import { DeleteResult } from "typeorm";
import { Technology, TechType } from "../Entities/Technology";
import { TechnologyRepository } from "../Repositories/Technology.repository";
import { deleteFromCloudinary, uploadToCLoudinary } from "../Adapters/CloudinaryAdapter";

export const createATechnologie: (
  tech: Partial<Technology> , file?: Express.Multer.File
) => Promise<Technology | undefined> = async (tech ,file) => {
  try {
    const result = await uploadToCLoudinary(file)
    const created = TechnologyRepository.create({...tech , logoUrl : result?.url , publicId :result?.public_id});
    return await TechnologyRepository.save(created);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findAllTechnologies: () => Promise<Technology[]> = async () => {
  try {
    return await TechnologyRepository.find();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const findTechnologiesByType: (
  type: TechType
) => Promise<Technology[]> = async (type) => {
  try {
    return await TechnologyRepository.find({
      where: {
        technologyType: type,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const findOneTechnology: (
  id: number
) => Promise<Technology | undefined | null> = async (id) => {
  try {
    return await TechnologyRepository.findOneBy({ id });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const removeOneTechnology: (
  id: number
) => Promise<DeleteResult | undefined> = async (id) => {
  try {
    return await TechnologyRepository.delete(id);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const modifyOneTechnology: (
  id: number,
  data: Partial<Technology>,
  file?: Express.Multer.File
) => Promise<DeleteResult | undefined> = async (id, data , file) => {
  try {
    
    if (file){
      const tech : Technology |null  = await TechnologyRepository.findOneBy({id})
      tech?.publicId? await deleteFromCloudinary(tech?.publicId):undefined
      const result = await uploadToCLoudinary(file)
      data.publicId = result?.public_id
      data.logoUrl = result?.url
    }

    return await TechnologyRepository.update(id, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
