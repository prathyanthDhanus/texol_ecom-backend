import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Types.ObjectId;
  stock: number;
  lowStockThreshold: number;
  images: string[]; 
  isDeleted: boolean;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastStockUpdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    stockStatus: {
      type: String,
      enum: ['in-stock', 'low-stock', 'out-of-stock'],
      default: 'in-stock',
    },
    lastStockUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to automatically update stock status
productSchema.pre('save', function(next) {
  const doc = this as any;
  if (doc.stock === 0) {
    doc.stockStatus = 'out-of-stock';
  } else if (doc.stock <= doc.lowStockThreshold) {
    doc.stockStatus = 'low-stock';
  } else {
    doc.stockStatus = 'in-stock';
  }
  
  doc.lastStockUpdate = new Date();
  next();
});

// Pre-update middleware to handle stock status updates
productSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate() as any;
  
  if (update.stock !== undefined) {
    if (update.stock === 0) {
      update.stockStatus = 'out-of-stock';
    } else if (update.stock <= (update.lowStockThreshold || 10)) {
      update.stockStatus = 'low-stock';
    } else {
      update.stockStatus = 'in-stock';
    }
    
    update.lastStockUpdate = new Date();
  }
  
  next();
});

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;