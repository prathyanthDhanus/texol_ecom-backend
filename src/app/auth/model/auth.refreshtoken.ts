import { Document, Schema, model, Model, Types } from "mongoose";

interface IRefreshToken extends Document {
  token: string;
  userId: Types.ObjectId;
  createdDate: Date;
  updatedDate: Date;
}

interface IRefreshTokenModel extends Model<IRefreshToken> {}

// RefreshToken Schema
const refreshTokenSchema = new Schema<IRefreshToken, IRefreshTokenModel>(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Auth", 
      required: true,
    },
  },
  {
    timestamps: { 
      createdAt: "createdDate", 
      updatedAt: "updatedDate" 
    },
    // toJSON: {
    //   transform: function (doc, ret) {
    //     delete ret.__v; 
    //   }
    // }
  }
);

refreshTokenSchema.index({ token: 1 });
refreshTokenSchema.index({ userId: 1 });


const RefreshToken = model<IRefreshToken, IRefreshTokenModel>(
  "RefreshToken",
  refreshTokenSchema
);

export default RefreshToken;