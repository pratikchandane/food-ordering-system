# Online Food Ordering System (Agile CI/CD Pipeline)

> **College FA-2 Activity:** Design and Demonstrate a Simple CI/CD Pipeline for an Agile Project  
> **Course / Lab:** DevOps & Agile Software Engineering  
> **Operating System:** Windows 10 / 11  
> **Application URL:** [http://localhost:3000](http://localhost:3000)  
> **Jenkins URL:** [http://localhost:8080](http://localhost:8080)  

---

## 1. Project Overview
This project is an **Online Food Ordering System** designed using beginner-friendly technologies (Node.js, Express, Vanilla HTML/CSS/JavaScript) and developed using an **Agile Scrum framework**. 

It includes:
1. **Interactive Menu:** Displays food items, descriptions, categories, and prices.
2. **Dynamic Cart & Price Calculator:** Real-time calculation of subtotal, 5% sales tax, delivery fee ($3.99 standard, FREE for orders $30+), and grand total.
3. **Order Confirmation:** Captures customer delivery information and produces a verified receipt with a unique Order ID and delivery time estimate.
4. **Automated Unit Testing:** 14 automated unit tests written with Node.js built-in test runner (`node:test`).
5. **Automated Code Quality Check:** Static analysis script validating syntax, code safety, and module contracts.
6. **Declarative Jenkins Pipeline (Jenkinsfile):** 5-stage automated CI/CD pipeline (*GitHub Checkout*, *Build*, *Automated Testing*, *Code Quality Check*, *Deployment*).
7. **Local Windows Deployment:** Automated deployment stage that launches the application in background on Windows and verifies connectivity via health check.

---

## 2. Explanation of Every File (Simple English)

| File / Folder | Purpose in Simple English |
| :--- | :--- |
| `package.json` | The project manifest. It lists project dependencies (like `express`) and defines short scripts to run tests (`npm test`), check quality (`npm run quality`), package the build (`npm run build`), and start the app (`npm start`). |
| `server.js` | The backend web server. It uses Express to serve frontend web pages and provides REST API routes: `/api/menu` (to get dishes), `/api/order` (to process orders), and `/api/health` (used by Jenkins to verify the app is running). |
| `src/menuData.js` | The food database. It contains an array of food dishes, their categories (Burgers, Pizzas, Pasta, Salads, Desserts, Beverages), prices, and emojis. |
| `src/orderCalculator.js` | The core business logic engine. Contains functions for calculating subtotal, tax (5%), delivery fees, grand total, and validating customer details before generating an order receipt. |
| `tests/orderCalculator.test.js` | The automated test suite containing 14 unit test cases. It tests that price calculations, tax formulas, free delivery rules, and error validations behave accurately. |
| `check-quality.js` | The code quality checker. It inspects all JavaScript files for syntax errors, looks for bad practices like forgotten `debugger;` statements, and verifies that required files and exported functions exist. |
| `public/index.html` | The user interface markup. Contains the header, category filter buttons, food menu grid, interactive shopping cart sidebar, customer checkout form, and order confirmation popup modal. |
| `public/style.css` | The styling file. Provides a clean, modern responsive layout with vibrant food colors, smooth card hover effects, and clean receipt formatting. |
| `public/app.js` | The client-side logic. Fetches menu data from the server, responds to `+` and `−` quantity clicks, recalculates cart totals in real-time, submits orders to the backend, and opens the confirmation modal. |
| `Jenkinsfile` | The automated pipeline blueprint. Tells Jenkins the exact sequence of 5 stages to execute when building, testing, validating, and deploying the application on Windows. |
| `AGILE_PLAN.md` | The Agile documentation containing 5 user stories, sprint planning tables, Definition of Done (DoD), and Gherkin Given-When-Then acceptance criteria. |
| `.gitignore` | Prevents heavy temporary folders like `node_modules/` or log files from being accidentally uploaded to Git. |

---

## 3. Explanation of Every Command (Simple English)

| Command | What it Does in Simple English |
| :--- | :--- |
| `npm install` | Downloads and installs required third-party libraries (such as `express`) listed in `package.json` into a local `node_modules` folder. |
| `npm start` | Runs `node server.js` to start the live web application on your computer on port 3000. |
| `npm test` | Runs the automated test runner (`node --test tests/*.test.js`) to verify all 14 unit tests. |
| `npm run quality` | Runs `node check-quality.js` to perform static code analysis and verify code health. |
| `npm run build` | Simulates the build packaging and asset verification phase in the CI pipeline. |
| `git init` | Initializes a brand-new, isolated Git version control repository inside the project folder. |
| `git add .` | Stages all files in the current folder so Git prepares them for a commit. |
| `git commit -m "..."` | Saves a permanent snapshot (commit) of the project files in Git history. |
| `git branch -M main` | Renames the default branch to `main`. |
| `git push -u origin main` | Pushes the local commits up to your remote GitHub repository. |

---

## 4. Verified Local Test Results (Run on this System)

During project setup, all automated tests and quality checks were executed and verified locally on this Windows system:

### 1. Automated Unit Tests (`npm test`):
```text
> node --test tests/*.test.js

▶ Order Price Calculation Tests
  ✔ TC01: calculateSubtotal should return 0 for empty or invalid item list (0.57ms)
  ✔ TC02: calculateSubtotal should accurately calculate total for single item (0.12ms)
  ✔ TC03: calculateSubtotal should accurately calculate total for multiple items (0.83ms)
  ✔ TC04: calculateTax should compute 5% sales tax correctly (0.15ms)
  ✔ TC05: calculateTax should round fractional cents correctly (0.14ms)
  ✔ TC06: calculateDeliveryFee should charge standard $3.99 for orders under $30.00 (0.11ms)
  ✔ TC07: calculateDeliveryFee should be $0.00 (FREE) for orders $30.00 and above (0.14ms)
  ✔ TC08: calculateTotal should return correct subtotal, tax, delivery fee, and grand total (0.27ms)
✔ Order Price Calculation Tests (3.24ms)
▶ Order Validation and Confirmation Tests
  ✔ TC09: validateOrder should accept valid order data (0.27ms)
  ✔ TC10: validateOrder should throw error when customer name is missing (0.42ms)
  ✔ TC11: validateOrder should throw error when address is missing (0.14ms)
  ✔ TC12: validateOrder should throw error when items list is empty (0.10ms)
  ✔ TC13: validateOrder should throw error when quantity is zero or negative (0.11ms)
  ✔ TC14: createOrderConfirmation should generate confirmation with orderId and status Confirmed (1.14ms)
✔ Order Validation and Confirmation Tests (2.44ms)
ℹ tests 14 | pass 14 | fail 0 | duration_ms 335.7ms
```

### 2. Code Quality Check (`npm run quality`):
```text
====================================================
       STAGE 4: AUTOMATED CODE QUALITY CHECK        
====================================================
1. Checking Project Structure Integrity... [PASS] (6 files)
2. Validating JavaScript Syntax... [PASS] (4 files)
3. Scanning for Forbidden Debugging Artifacts... [PASS] (4 files)
4. Verifying API & Module Contract Integrity... [PASS] (6 exports)
====================================================
Results: 24 Checks Passed | 0 Issues Found
====================================================
All Code Quality Checks PASSED successfully! Code is production ready.
```

---

## 5. Quick Local Run (Without Jenkins)

To run and test the application directly in PowerShell:

```powershell
# Step 1: Open project directory in PowerShell
cd "c:\Users\user5\Desktop\015\agile project"

# Step 2: Run tests
npm test

# Step 3: Run code quality check
npm run quality

# Step 4: Start the server
npm start
```
Open your web browser and go to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 6. Real Jenkins Pipeline Demonstration: Step-by-Step Manual Guide

*Note: Jenkins is currently installed and running as a Windows service on your machine at `http://localhost:8080`. However, the GitHub repository and Jenkins job must be linked manually using the steps below.*

### Step 1: Create a GitHub Repository and Push Your Code
1. Open your web browser and sign in to [https://github.com](https://github.com).
2. Click **New Repository**.
3. Name it: `online-food-ordering-system`.
4. Choose **Public** (or Private) and leave README/gitignore unchecked (we already created them). Click **Create repository**.
5. Copy the repository URL (e.g., `https://github.com/<YOUR_USERNAME>/online-food-ordering-system.git`).
6. In your Windows PowerShell terminal, run:
   ```powershell
   cd "c:\Users\user5\Desktop\015\agile project"
   git add .
   git commit -m "feat: complete online food ordering system with CI/CD pipeline"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/online-food-ordering-system.git
   git push -u origin main
   ```

*(Alternative Local Git Option if you don't have a GitHub account right now)*:  
Jenkins can also build directly from your local directory! In Jenkins, you can set the repository URL to `file:///c:/Users/user5/Desktop/015/agile project` or paste the Jenkinsfile directly into the pipeline job.

---

### Step 2: Open Jenkins Dashboard
1. Open your browser and navigate to:  
   👉 **[http://localhost:8080](http://localhost:8080)**
2. If prompted to log in:
   - Enter your Jenkins username and password.
   - *(If this is your first time accessing Jenkins on this PC, find the initial admin password located in `C:\ProgramData\Jenkins\.jenkins\secrets\initialAdminPassword` or `C:\Program Files\Jenkins\secrets\initialAdminPassword`).*

---

### Step 3: Create the CI/CD Pipeline Job in Jenkins
1. On the Jenkins home screen, click **New Item** (left menu).
2. Enter an item name: `Food-Ordering-CI-CD-Pipeline`.
3. Select **Pipeline** (not Freestyle project).
4. Click **OK** at the bottom.

---

### Step 4: Configure the Pipeline Script
1. Scroll down to the **Pipeline** section at the bottom.
2. Under **Definition**, you have two simple choices:

#### Choice A (Recommended: Direct Jenkinsfile from GitHub):
- Select **Pipeline script from SCM**.
- SCM: Select **Git**.
- **Repository URL**: Paste your GitHub URL (e.g., `https://github.com/<YOUR_USERNAME>/online-food-ordering-system.git`).
- **Branch Specifier**: Change `*/master` to `*/main` (or whichever branch you pushed).
- **Script Path**: Verify it says `Jenkinsfile`.
- Click **Save**.

#### Choice B (Quickest Local Demonstration without GitHub authentication):
- Select **Pipeline script** (direct script).
- Open the [`Jenkinsfile`](Jenkinsfile) from this project in Notepad or VS Code, copy all contents, and paste it directly into the script box.
- *(Note: In Choice B, replace `checkout scm` in Stage 1 with `echo 'Local workspace checkout verified'`)*.
- Click **Save**.

---

### Step 5: Execute the Pipeline ("Build Now")
1. On the left sidebar of your new job, click **Build Now**.
2. Watch Build `#1` start in the **Build History** box on the bottom left.
3. Click on `#1` -> **Console Output** to view the live build execution logs in real time.
4. Go back to the pipeline page to see the **Stage View**:
   - 🟩 **GitHub Checkout** (Source code checked out)
   - 🟩 **Build** (`npm install` and asset packaging)
   - 🟩 **Automated Testing** (All 14 tests run and pass)
   - 🟩 **Code Quality Check** (Static analysis passes)
   - 🟩 **Deployment** (App launched locally on Windows on port 3000)

---

### Step 6: Demonstrate to Your Evaluator / Faculty
1. **Show Jenkins:** Show the green Stage View matrix with all 5 stages passed.
2. **Show Console Output:** Show where the 14 automated tests passed and code quality verified.
3. **Show Live App:** Open [http://localhost:3000](http://localhost:3000) in front of the evaluator:
   - Show menu cards and filter by category (e.g. "Burgers" or "Pizzas").
   - Click `+` to add items to cart and show the dynamic subtotal, tax, and free delivery progress bar changing live.
   - Enter customer name and address, click "Place Order", and show the official Order Confirmation receipt modal.
4. **Show Agile Documentation:** Open `AGILE_PLAN.md` to demonstrate the 5 user stories, sprint planning, and Definition of Done.

---

## 7. Viva / Evaluation Questions & Answers

**Q1: What is CI/CD and why is it used in Agile?**  
*Answer:* CI (Continuous Integration) is the practice of automatically building and testing code changes frequently. CD (Continuous Deployment) automatically delivers or deploys the tested code to production or a staging environment. In Agile, CI/CD ensures fast feedback loops, prevents integration bugs, and enables teams to ship working software incrementally every sprint.

**Q2: What are the 5 stages in your Jenkinsfile?**  
*Answer:*
1. **GitHub Checkout:** Pulls the latest source code from version control.
2. **Build:** Installs dependencies (`npm install`) and packages application assets.
3. **Automated Testing:** Runs unit tests (`npm test`) to verify business logic and calculations.
4. **Code Quality Check:** Performs static analysis (`npm run quality`) to enforce syntax and code standards.
5. **Deployment:** Safely stops any outdated instance, launches the node server in the background, and tests the `/api/health` endpoint to verify successful startup.

**Q3: How does the pipeline handle a test failure?**  
*Answer:* If any of the 14 unit tests fail, the `Automated Testing` stage exits with a non-zero code. Jenkins immediately stops the pipeline, marks the build as RED (Failed), and blocks the Deployment stage, preventing broken code from reaching users.


## Food Menu Feature

The Online Food Delivery System allows customers
to view available food items and their prices.

### Sample Menu

| Food Item | Price |
|---|---:|
| Veg Burger | 120 |
| Pizza | 250 |
| Sandwich | 100 |

Customers can browse the menu before placing an order.

