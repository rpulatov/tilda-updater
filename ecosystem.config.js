module.exports = {
  apps: [
    {
      name: 'roby-tilda',
      script: './src/index.js',
      instances: '1',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      log_date_format: "DD-MM-YYYY HH:mm:ss",
    },
  ],
}
