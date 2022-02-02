import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { ImportantEnum } from 'src/types/types';

export type TodoDocument = Todo & Document;

@Schema()
export class Todo {
  @Prop()
  userId: number;

  @Prop()
  id: number;

  @Prop()
  title: string;

  @Prop()
  completed: boolean;

  @Prop(
    raw({
      type: String,
      enum: [
        ImportantEnum.NONE,
        ImportantEnum.HIGH,
        ImportantEnum.NORMAL,
        ImportantEnum.LOW,
      ],
      default: ImportantEnum.NONE,
    }),
  )
  important: ImportantEnum;
}

export const TodoSchema = SchemaFactory.createForClass(Todo);
