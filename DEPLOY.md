# 🚀 Quick Deploy Guide - Firebase Hosting

Your app is already configured for Firebase Hosting! Follow these simple steps:

## Step 1: Login to Firebase

Open your terminal and run:
```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

## Step 2: Set Environment Variables (if needed)

If your app uses `GEMINI_API_KEY`, create a `.env` file in the project root:
```bash
GEMINI_API_KEY=your_api_key_here
```

**Note**: Make sure `.env` is in your `.gitignore` to keep your API key secure!

## Step 3: Build and Deploy

Run the deploy command:
```bash
npm run deploy
```

This will:
1. Build your app (creates `dist` folder)
2. Deploy to Firebase Hosting

## Step 4: Access Your Live App

After deployment, your app will be live at:
- **Primary URL**: `https://nomad-ehr.web.app`
- **Alternative URL**: `https://nomad-ehr.firebaseapp.com`

Share these links with anyone you want!

---

## 🔄 Updating Your App

To update your deployed app, just run:
```bash
npm run deploy
```

---

## 🆘 Troubleshooting

### "Failed to authenticate"
- Run `firebase login` again
- Make sure you're logged into the correct Google account

### "Build failed"
- Check that all dependencies are installed: `npm install`
- Verify your `.env` file has the required variables
- Check the build output for specific errors

### "Deployment failed"
- Make sure you're in the project directory
- Verify `firebase.json` exists and is configured correctly
- Check that the `dist` folder was created after building

### Environment variables not working
- Make sure `.env` file exists before running `npm run build`
- Vite reads environment variables at build time, not runtime
- For runtime variables, consider using Firebase Remote Config

---

## 📊 Firebase Hosting Free Tier

Firebase Hosting free tier includes:
- ✅ 10 GB storage
- ✅ 360 MB/day data transfer
- ✅ Free SSL certificate
- ✅ Global CDN
- ✅ Custom domain support (optional)

This is more than enough for sharing with friends and small projects!

---

## 🎯 Next Steps

1. ✅ Deploy your app using the steps above
2. Test your live app thoroughly
3. Share the link with friends
4. (Optional) Add a custom domain later if needed

Happy deploying! 🎉

