module.exports = {
  apps: [
    {
      name: 'koncolawas-api',
      cwd: '/home/ubuntu/koncolawas/backend',
      script: 'dist/src/main.js',
      interpreter: 'node',
      interpreter_args: '--env-file=.env',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'koncolawas-web',
      cwd: '/home/ubuntu/koncolawas/frontend',
      script: 'node_modules/.bin/next',
      args: 'start --port 3002',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
