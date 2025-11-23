# Hosting Guide for Nomad EHR

This guide covers free hosting options that allow you to share your app with friends **without buying a custom domain**. All options provide free subdomains.

## 🏆 Recommended: Firebase Hosting

Since you're already using Firebase, this is the **easiest and most integrated** option.

### Why Firebase Hosting?
- ✅ Already using Firebase (Firestore)
- ✅ Free SSL certificate
- ✅ Fast global CDN
- ✅ Free subdomain: `your-project.web.app` or `your-project.firebaseapp.com`
- ✅ Easy deployment with Firebase CLI
- ✅ Automatic HTTPS

### Setup Steps:

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting** in your project:
   ```bash
   firebase init hosting
   ```
   
   When prompted:
   - Select your existing Firebase project: `nomad-ehr`
   - Public directory: `dist` (Vite's output folder)
   - Configure as single-page app: **Yes**
   - Set up automatic builds: **No** (or Yes if you want GitHub integration)
   - Overwrite index.html: **No**

4. **Build your app**:
   ```bash
   npm run build
   ```

5. **Deploy**:
   ```bash
   firebase deploy --only hosting
   ```

6. **Share your link**:
   - Your app will be live at: `https://nomad-ehr.web.app` or `https://nomad-ehr.firebaseapp.com`
   - Share this link with your friends!

### Environment Variables:
Since you're using `GEMINI_API_KEY`, you'll need to handle it. Options:
- **Option A**: Add it to Firebase Hosting environment (requires Firebase Functions)
- **Option B**: Use Vite's build-time environment variables (set in `.env` before building)
- **Option C**: Use Firebase Remote Config (for non-sensitive config)

For now, make sure your `.env` file has `GEMINI_API_KEY` set before running `npm run build`.

---

## 🚀 Alternative Options

### 1. Vercel (Great for React Apps)

**Free subdomain**: `your-project.vercel.app`

**Setup**:
1. Install Vercel CLI: `npm install -g vercel`
2. Run: `vercel` in your project root
3. Follow the prompts
4. Your app will be live instantly!

**Or use GitHub integration**:
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variable `GEMINI_API_KEY` in Vercel dashboard
5. Deploy automatically on every push!

---

### 2. Netlify

**Free subdomain**: `your-project.netlify.app`

**Setup**:
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Build your app: `npm run build`
3. Deploy: `netlify deploy --prod --dir=dist`
4. Follow prompts to create account/login

**Or drag & drop**:
1. Build: `npm run build`
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
3. Drag your `dist` folder
4. Done!

---

### 3. Cloudflare Pages

**Free subdomain**: `your-project.pages.dev`

**Setup**:
1. Push code to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
3. Pages → Create a project
4. Connect GitHub repository
5. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Add environment variable `GEMINI_API_KEY`
7. Deploy!

---

### 4. GitHub Pages

**Free subdomain**: `your-username.github.io/your-repo-name`

**Note**: Requires a bit more setup for SPAs. You'll need to configure Vite for GitHub Pages.

**Setup**:
1. Update `vite.config.ts` to set `base: '/your-repo-name/'`
2. Build: `npm run build`
3. Install gh-pages: `npm install -D gh-pages`
4. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
5. Run: `npm run deploy`

---

## 📊 Comparison

| Platform | Free Subdomain | Ease of Setup | Best For |
|----------|---------------|---------------|----------|
| **Firebase Hosting** | ✅ `.web.app` | ⭐⭐⭐⭐⭐ | Already using Firebase |
| **Vercel** | ✅ `.vercel.app` | ⭐⭐⭐⭐⭐ | React apps, GitHub integration |
| **Netlify** | ✅ `.netlify.app` | ⭐⭐⭐⭐ | Drag & drop simplicity |
| **Cloudflare Pages** | ✅ `.pages.dev` | ⭐⭐⭐⭐ | Fast global CDN |
| **GitHub Pages** | ✅ `.github.io` | ⭐⭐⭐ | Free static hosting |

---

## 🔒 Important: Environment Variables

All platforms support environment variables. Make sure to:
1. Add `GEMINI_API_KEY` in your hosting platform's dashboard
2. Never commit `.env` files with real API keys to GitHub
3. Use platform-specific environment variable settings

---

## 🎯 Quick Start Recommendation

**For your use case (sharing with friends, no custom domain needed):**

1. **Firebase Hosting** - Best choice since you're already using Firebase
2. **Vercel** - Second choice if you want GitHub auto-deploy

Both are free, fast, and provide shareable links immediately!

---

## 📝 Next Steps After Deployment

1. Test your deployed app thoroughly
2. Share the link with friends
3. Monitor usage (all platforms provide basic analytics)
4. Consider adding a custom domain later (optional, not required)

---

## 🆘 Troubleshooting

### Build fails
- Check that all dependencies are in `package.json`
- Ensure `GEMINI_API_KEY` is set (if needed at build time)
- Check build logs in hosting platform dashboard

### App doesn't load
- Verify Firebase config allows your hosting domain
- Check browser console for errors
- Ensure Firestore security rules allow public access (if needed)

### Environment variables not working
- Check platform-specific documentation
- Ensure variables are set in production environment
- Rebuild/redeploy after adding variables

