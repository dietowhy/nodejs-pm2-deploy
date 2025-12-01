require("dotenv").config({ path: "../.env.deploy" });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REF,
  DEPLOY_REPO,
  DEPLOY_SSH_KEY,
} = process.env;

module.exports = {
  apps: [
    {
      name: "api",
      script: "./dist/app.js",
      env: { NODE_ENV: "production" },
    },
  ],

  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      key: DEPLOY_SSH_KEY,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      ssh_options: "StrictHostKeyChecking=no",
      "pre-deploy-local": `bash scripts/deployEnv.sh ${DEPLOY_USER}@${DEPLOY_HOST} ${DEPLOY_PATH} ${DEPLOY_KEY}`,
      "post-deploy": [
        "cd backend",

        "npm install",

        "npm run build",

        "pm2 startOrReload ecosystem.config.js --env production --update-env",
      ].join(" && "),
    },
  },
};
