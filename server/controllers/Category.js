const Category = require("../Model/Category");
const Course = require("../Model/Course");





/// fetch the name and description
// valiation
// create the entry in db
// then return respoinse

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategorysDetails);
    return res.status(200).json({
      success: true,
      message: "Category Created Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    });
  }
};


// find all the courses 
// first find all the courses which are publiched using populate


exports.showAllCategories = async (req, res) => {
  try {
    // Find categories that actually have published courses by querying Course collection
    const publishedCourses = await Course.find({ status: "Published" }, { category: 1 }).lean();
    const categoryIds = [...new Set(publishedCourses.map((c) => String(c.category)))].filter(Boolean);

    if (categoryIds.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const categories = await Category.find({ _id: { $in: categoryIds } }).populate({
      path: "courses",
      match: { status: "Published" },
    });

    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// public endpoint to return all categories (used by admin/instructor forms)
exports.getAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find();
    res.status(200).json({ success: true, data: allCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;

    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: true,
        message: "No courses found for the selected category.",
      });
    }

    const categoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    console.log();

    const allCategories = await Category.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};