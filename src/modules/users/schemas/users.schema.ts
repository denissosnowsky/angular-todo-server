import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  photo: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop(
    raw({
      type: String,
      default: '',
    }),
  )
  changedPassword: string;

  @Prop(
    raw({
      type: Boolean,
      default: false,
    }),
  )
  isActivated: boolean;

  @Prop()
  activationLink: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
