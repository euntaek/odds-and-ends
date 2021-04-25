module.exports = {
  future: {
    webpack5: true,
  },
  i18n: {
    locales: ['ko-KR'],
    defaultLocale: 'ko-KR',
  },
  async rewrites() {
    return [
      {
        source: '/@:username',
        destination: '/users/profile',
      },
      {
        source: '/@:username/following',
        destination: '/users/following',
      },
      {
        source: '/@:username/followers',
        destination: '/users/followers',
      },
    ];
  },
};
