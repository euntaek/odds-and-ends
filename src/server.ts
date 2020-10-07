import database from './database';
import { getRepository } from 'typeorm';

import './env';
import app from './app';
import User from './entity/User';
import Profile from './entity/Profile';
import Post from './entity/Post';
import Tag from './entity/Tag';

const { PORT } = process.env;

(async () => {
  await database.connection();
  const userRepo = getRepository(User);
  const profileRepo = getRepository(Profile);
  const postRepo = getRepository(Post);
  const tagRepo = getRepository(Tag);

  const user = new User();
  const profile = new Profile();
  const post1 = new Post();
  const post2 = new Post();
  const tag1 = new Tag();
  const tag2 = new Tag();

  // user, porfile test
  profile.display_name = 'taek';
  await profileRepo.save(profile);

  user.email = 'zmn5119@gmail.com';
  user.hashed_password = '1234';
  user.profile = profile;
  userRepo.save(user);

  // post create test
  post1.body = 'body';
  await postRepo.save(post1);

  // tag create test
  tag1.name = 'tag1';
  tag2.name = 'tag2';
  await tagRepo.save([tag1, tag2]);

  // tag post join table test
  post2.body = 'body2';
  post2.tags = [tag1, tag2];
  await postRepo.save(post2);

  app.listen(PORT, () => {
    console.log('Listening to port', PORT);
  });
})();
