import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStockHistory extends Document {
  productId: Types.ObjectId;
  previousStock: number;
  newStock: number;
  changeAmount: number;
  changeType: "increase" | "decrease" | "set";
  reason: string;
  performedBy: Types.ObjectId;
  timestamp: Date;
}

const stockHistorySchema = new Schema<IStockHistory>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    previousStock: {
      type: Number,
      required: true,
      min: 0,
    },
    newStock: {
      type: Number,
      required: true,
      min: 0,
    },
    changeAmount: {
      type: Number,
      required: true,
    },
    changeType: {
      type: String,
      enum: ["increase", "decrease", "set"],
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "manual_update",
        "order_placed",
        "order_cancelled",
        "restock",
        "damage",
        "return",
        "adjustment",
      ],
    },
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
stockHistorySchema.index({ productId: 1, timestamp: -1 });

const StockHistory = mongoose.model<IStockHistory>(
  "StockHistory",
  stockHistorySchema
);
export default StockHistory;
