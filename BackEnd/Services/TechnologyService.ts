import { DeleteResult } from "typeorm";
import { Technology, TechType } from "../Entities/Technology";
import { TechnologyRepository } from "../Repositories/TechnologyRepository";
import { deleteFromCloudinary, uploadToCLoudinary } from "../Adapters/CloudinaryAdapter";
import { errorhandler } from "../Handlers/ErrorHandlers";
import { NullableOrUndefined } from "../Types/UtilityTypes";

export const createATechnologie: (
  tech: Partial<Technology> , file?: Express.Multer.File
) => Promise<Technology | undefined> = async (tech ,file) => {
  try {
    const result = await uploadToCLoudinary(file)
    const created = TechnologyRepository.create({...tech , logoUrl : result?.url , publicId :result?.public_id});
    return await TechnologyRepository.save(created);
  } catch (error) {
    errorhandler(error)
    throw error;
  }
};

export const findAllTechnologies: () => Promise<Technology[]> = async () => {
  try {
    return await TechnologyRepository.find();
  } catch (error) {
    errorhandler(error)
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
    errorhandler(error)
    throw error;
  }
};

export const findOneTechnology: (
  id: number
) => Promise<Technology | undefined | null> = async (id) => {
  try {
    return await TechnologyRepository.findOneBy({ id });
  } catch (error) {
    errorhandler(error)
    throw error; 
  }
};

export const removeOneTechnology: (
  id: number
) => Promise<DeleteResult | undefined> = async (id) => {
  try {
    const techToDelete :NullableOrUndefined<Technology> = await TechnologyRepository.findOneBy({id})

    if (techToDelete?.publicId) {
      await deleteFromCloudinary(techToDelete.publicId)
    }

    return await TechnologyRepository.delete(id);
  } catch (error) {
    errorhandler(error)
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
    errorhandler(error)
    throw error;
  }
};
