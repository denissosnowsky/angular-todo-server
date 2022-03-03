import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
  @Prop()
  url: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);
