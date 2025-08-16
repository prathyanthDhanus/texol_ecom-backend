import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: Types.ObjectId;
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const cartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    itemCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to calculate totals
cartSchema.pre("save", function (next) {
  this.totalAmount = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  this.itemCount = this.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  next();
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
