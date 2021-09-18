import faker from "faker";
import { IBlog, IComment, IUser, User } from "./models";
import axios, { AxiosResponse } from "axios";
const URI = "http://localhost:3000";

export const generateFakeData = async (
  userCount: number,
  blogsPerUser: any,
  commentsPerUser: any
) => {
  try {
    if (typeof userCount !== "number" || userCount < 1)
      throw new Error("userCount must be a positive integer");
    if (typeof blogsPerUser !== "number" || blogsPerUser < 1)
      throw new Error("blogsPerUser must be a positive integer");
    if (typeof commentsPerUser !== "number" || commentsPerUser < 1)
      throw new Error("commentsPerUser must be a positive integer");
    const users: IUser[] = [];
    const blogs: Promise<AxiosResponse<IBlog>>[] = [];
    const comments: Promise<AxiosResponse<IComment>>[] = [];

    for (let i = 0; i < userCount; i++) {
      users.push(
        new User({
          username: faker.internet.userName() + Math.ceil(Math.random() * 100),
          name: {
            first: faker.name.firstName(),
            last: faker.name.lastName(),
          },
          age: 10 + Math.ceil(Math.random() * 50),
          email: faker.internet.email(),
        })
      );
    }

    console.log("fake data inserting to database...");

    await User.insertMany(users);
    console.log(`${users.length} fake users generated!`);

    users.map((user) => {
      for (let i = 0; i < blogsPerUser; i++) {
        blogs.push(
          axios.post<IBlog>(`${URI}/blog`, {
            title: faker.lorem.words(),
            content: faker.lorem.paragraphs(),
            isLive: true,
            userId: user._id,
          })
        );
      }
    });

    let newBlogs = await Promise.all(blogs);
    console.log(`${newBlogs.length} fake blogs generated!`);

    users.map((user) => {
      for (let i = 0; i < commentsPerUser; i++) {
        let index = Math.floor(Math.random() * blogs.length);
        comments.push(
          axios.post(`${URI}/blog/${newBlogs[index].data._id}/comment`, {
            content: faker.lorem.sentence(),
            userId: user._id,
          })
        );
      }
    });

    await Promise.all(comments);
    console.log(`${comments.length} fake comments generated!`);
    console.log("COMPLETE!!");
  } catch (err) {
    console.log(err);
  }
};
