import { processHierarchyData } from "../utils/graphProcessor.js";

export const processHierarchy = (req, res, next) => {
  try {
    const { data } = req.body || {};

    if (!Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        error: "`data` must be an array of edge strings"
      });
    }

    const processed = processHierarchyData(data);
    const userId = process.env.USER_ID || "";
    const emailId = process.env.EMAIL_ID || "";
    const collegeRollNumber = process.env.COLLEGE_ROLL_NUMBER || "";

    return res.status(200).json({
      user_id: userId,
      email_id: emailId,
      college_roll_number: collegeRollNumber,
      hierarchies: processed.hierarchies,
      invalid_entries: processed.invalidEntries,
      duplicate_edges: processed.duplicateEdges,
      summary: {
        total_trees: processed.summary.totalTrees,
        total_cycles: processed.summary.totalCycles,
        largest_tree_root: processed.summary.largestTreeRoot
      }
    });
  } catch (error) {
    return next(error);
  }
};
