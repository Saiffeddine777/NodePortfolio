import { errorhandler } from "./ErrorHandlers";
import type { AppRepository } from "../Types/UtilityTypes";
export const handlePagination: (
  limit: number,
  page: number,
  repository: AppRepository,
) => Promise<any> = async (limit, page, repository) => {
  try {
    const[data , total] = await repository.findAndCount({
      skip :(page-1)*limit,
      take :limit,
      order :{id:"ASC"}
    })

    return {
      data,
      total,
      page, 
      lastPage : Math.ceil(total/limit)
    }
  } catch (error) {
    errorhandler(error);
    throw error;
  }
};
