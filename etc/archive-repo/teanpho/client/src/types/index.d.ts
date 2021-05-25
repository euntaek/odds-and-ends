interface Profile {
  id: string;
  displayName: string;
  about: string;
  thumbnail: string;
}

interface User {
  id: string;
  email: string;
  username: string;
  isConfirmed: boolean;
  profile?: Profile;
}
