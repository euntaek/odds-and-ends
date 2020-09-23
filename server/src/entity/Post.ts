import { Entity, ObjectIdColumn, Column, ObjectID, CreateDateColumn } from 'typeorm';

@Entity()
export default class Post {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  tags: string[];

  @CreateDateColumn()
  publishedDate: Date;
}
