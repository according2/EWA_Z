# Preview on GitHub Pages

This project is pre-configured to automatically build and deploy to GitHub Pages whenever you push to the `main` or `master` branch. The deployment process is handled entirely by a GitHub Actions workflow, meaning you don't need to run any terminal commands to deploy your preview.

## Step-by-Step Implementation Instructions

The GitHub Actions workflow is already set up and located at `.github/workflows/deploy.yml`. When you export or push this repository to GitHub, follow these steps in the GitHub interface to enable the Pages preview:

### 1. Push Code to GitHub
Ensure all your code is pushed to your GitHub repository. The deployment workflow triggers on pushes to the `main` (or `master`) branch.

### 2. Configure GitHub Pages in Settings
By default, GitHub might not know you want to use GitHub Actions for Pages. You need to enable it:
1. Go to your repository on GitHub.
2. Click on the **Settings** tab.
3. In the left sidebar, scroll down and click on **Pages** (under the "Code and automation" section).
4. Look for the **Build and deployment** section.
5. Under the **Source** dropdown, select **GitHub Actions**.

### 3. Verify the Deployment
1. Go to the **Actions** tab in your GitHub repository.
2. You should see a workflow titled **Deploy to GitHub Pages** running (or already finished if it triggered automatically).
3. If it hasn't run yet, you can trigger it manually:
   - Click on **Deploy to GitHub Pages** in the left sidebar under "All workflows".
   - Click the **Run workflow** dropdown button on the right and click the **Run workflow** button.
4. Once the workflow completes successfully (shows a green checkmark), your app is deployed!

### 4. Access Your Preview URL
1. Go back to the **Settings** > **Pages** menu, or look at the completed Actions workflow.
2. You will see a message saying "Your site is live at `https://[your-username].github.io/[your-repo-name]/`".
3. Click the link to view your live application.

## How it works
- The project uses Vite as a bundler.
- `vite.config.ts` is configured with `base: './'` so that assets load correctly regardless of the GitHub Pages repository URL path.
- The workflow at `.github/workflows/deploy.yml` installs dependencies (`npm ci`), builds the project (`npm run build`), and uploads the `dist` directory as an artifact to GitHub Pages.
