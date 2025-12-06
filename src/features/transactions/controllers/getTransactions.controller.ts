import { Request, Response, NextFunction } from "express";
import Transaction from "../model/transaction.model";
import Account from "../../accounts/model/account.model";
import { IUser } from "../../users/model/user.model";
import validateRequest from "../../../core/utils/validate";
import getTransactionsQuerySchema from "../validation/getTransactions.validation";
import { BadRequestError, NotFoundError } from "../../../core/utils/errors";

const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user as IUser;
    const queryParams = validateRequest(req.query, getTransactionsQuerySchema);

    const {
      page,
      limit,
      sortBy,
      sortOrder,
      accountId,
      categories,
      type,
      startDate,
      endDate,
      minAmount,
      maxAmount,
    } = queryParams;

    // Build base query
    const query: any = { createdBy: user._id };

    // Filter by account
    if (accountId) {
      // Verify account belongs to user
      const account = await Account.findOne({
        _id: accountId,
        createdBy: user._id,
      });

      if (!account) {
        throw new NotFoundError("Account not found");
      }

      query.account = accountId;
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Filter by categories
    if (categories) {
      const categoryIds = categories.split(",").map((id: string) => id.trim());
      query["splits.category"] = { $in: categoryIds };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .populate("account", "name institution")
        .populate("splits.category", "name icon color")
        .populate("transferToAccount", "name")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Transaction.countDocuments(query),
    ]);

    // Post-query filtering by amount (if specified)
    let filteredTransactions = transactions;
    if (minAmount !== undefined || maxAmount !== undefined) {
      filteredTransactions = transactions.filter((transaction: any) => {
        const totalAmount = transaction.splits.reduce(
          (sum: number, split: any) => sum + split.amount,
          0
        );

        if (minAmount !== undefined && totalAmount < minAmount) return false;
        if (maxAmount !== undefined && totalAmount > maxAmount) return false;
        return true;
      });
    }

    // Calculate pagination metadata
    const pages = Math.ceil(total / limit);
    const hasNext = page < pages;
    const hasPrev = page > 1;

    // Build filters object for response
    const appliedFilters: any = {};
    if (accountId) appliedFilters.accountId = accountId;
    if (categories) appliedFilters.categories = categories.split(",");
    if (type) appliedFilters.type = type;
    if (startDate) appliedFilters.startDate = startDate;
    if (endDate) appliedFilters.endDate = endDate;
    if (minAmount !== undefined) appliedFilters.minAmount = minAmount;
    if (maxAmount !== undefined) appliedFilters.maxAmount = maxAmount;

    res.status(200).json({
      transactions: filteredTransactions,
      pagination: {
        page,
        limit,
        total,
        pages,
        hasNext,
        hasPrev,
      },
      filters: appliedFilters,
      sort: {
        sortBy,
        sortOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default getTransactions;
