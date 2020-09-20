import { Entity, ObjectIdColumn, Column, ObjectID, CreateDateColumn } from 'typeorm';

@Entity()
export default class Post {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  title: string;

  @Column()
  body: string;

  @Column()
  tags: string[];

  @CreateDateColumn()
  publishedDate: Date;
}
