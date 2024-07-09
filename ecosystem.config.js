module.exports = {
  apps: [
    {
      name: 'express-graphql-example',
      script: './dist/app.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: process.env.NODE_ENV || 'dev',
      },
    },
  ],
};
