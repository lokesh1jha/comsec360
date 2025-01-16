import { getAllProjects, getProjectsWithFilter, projectUserDetailsDb } from "../db/multi-user";
import { getCompaniesByIdAndStatus } from "../db/multi-user";


/* company Service will be added in future
export const getCompaniesService = async (
    incorporationStartDate: string,
    incorporationEndDate: string,
    annualReturnStartDate: string,
    annualReturnEndDate: string,
    financialStartDate: string,
    financialEndDate: string,
    page: number,
    pageSize: number
) => {
    const hasFilter = incorporationStartDate || incorporationEndDate || annualReturnStartDate || annualReturnEndDate || financialStartDate || financialEndDate;

    if (!hasFilter) {
        return await getAllCompanies(page, pageSize);
    }
    return await getCompaniesWithFilter(
        incorporationStartDate,
        incorporationEndDate,
        annualReturnStartDate,
        annualReturnEndDate,
        financialStartDate,
        financialEndDate,
        page,
        pageSize
    );
};
*/

export const getDashboardCountService = async (userId: string) => {
    return await getCompaniesByIdAndStatus(userId);
};

export const getProjectsService = async (
    userId: string,
    filterText: string,
    projectStartDateFrom: string,
    projectStartDateTo: string,
    processedBy: string,
    completedDateFrom: string,
    completedDateTo: string
) => {
    const hasFilter = filterText || projectStartDateFrom || projectStartDateTo || processedBy || completedDateFrom || completedDateTo;
    console.log("hasFilter", hasFilter);
    if (!hasFilter) {
        return await getAllProjects(userId);
    }
    return await getProjectsWithFilter(
        userId,
        filterText,
        projectStartDateFrom,
        projectStartDateTo,
        processedBy,
        completedDateFrom,
        completedDateTo
    );
};


export const getProjectUserDetails = async (
    userId: string,
    projectId: string
) => {
    return await projectUserDetailsDb(userId, projectId);
}