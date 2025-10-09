import { apiConnector } from "../apiConnector";
import { categories, courseEndpoints } from "../apis";

const { CATEGORIES_API } = categories;
const { CREATE_COURSE_API } = courseEndpoints; // not used but kept for consistency

export const createCategory = async (data, token) => {
  try {
    const response = await apiConnector("POST", CATEGORIES_API.replace("/showAllCategories","/createCategory"), data, {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    });
    if (!response?.data?.success) throw new Error(response?.data?.message || "Could not create category");
    return response.data;
  } catch (error) {
    console.log("CREATE CATEGORY API ERROR", error);
    throw error;
  }
};
