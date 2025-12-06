import mongoose, { Document, Model } from "mongoose";
import { CATEGORY_APPLICABLE_FEATURES } from "../../../core/utils/constants";

export type CategoryAppliesTo =
  (typeof CATEGORY_APPLICABLE_FEATURES)[keyof typeof CATEGORY_APPLICABLE_FEATURES];

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  color: string;
  appliesTo: CategoryAppliesTo[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
      match: /^#[0-9A-F]{6}$/i,
    },
    appliesTo: {
      type: [String],
      enum: Object.values(CATEGORY_APPLICABLE_FEATURES),
      required: true,
      validate: {
        validator: function (value: CategoryAppliesTo[]) {
          return value.length > 0;
        },
        message: "Category must apply to at least one feature type",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: name must be unique per user
CategorySchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Category: Model<ICategory> = mongoose.model<ICategory>(
  "Category",
  CategorySchema
);
export default Category;
