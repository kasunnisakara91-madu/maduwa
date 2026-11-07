# Heroku deployment

1. Create a new Heroku app.
2. Deploy this project folder (the folder containing `package.json` and `Procfile`) from GitHub or Heroku's supported deployment flow.
3. In **Settings > Config Vars**, add the variables required by your enabled features. Use `.env.example` as the key-name checklist; do not upload your real `.env` file to GitHub.
4. Make sure the app uses the **Heroku Node.js buildpack**. Heroku will install the root dependencies, run `heroku-postbuild` to build the React frontend into `public/`, then start `node index.js` using the assigned `PORT`.
5. After deployment, test `/api/health` and then open the app root URL.

The Firebase configuration is currently defined in `backend/db.js`; setting Firebase Config Vars alone will not replace those hard-coded values unless you update that file to read from `process.env`. Keep Firebase Realtime Database rules and OAuth redirect URLs configured for your deployed domain.

Note: Some downloader/scraper endpoints may rely on third-party sites or browser binaries and can fail independently of the Heroku deployment.
