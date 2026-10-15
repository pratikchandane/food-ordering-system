# Agile Project Plan: Online Food Ordering System
**Activity:** FA-2: Design and Demonstrate a Simple CI/CD Pipeline for an Agile Project  
**Methodology:** Agile Scrum  
**Target Release:** Version 1.0.0  

---

## 1. Project Overview & Vision
The goal of this project is to develop a lightweight, user-friendly **Online Food Ordering System** that allows customers to browse menu items, customize quantities, calculate prices with tax and delivery rules in real time, and receive an order confirmation receipt. 

The software development process follows **Agile principles**, organized into two one-week sprints with automated continuous integration and continuous deployment (CI/CD) implemented via Jenkins.

---

## 2. Product Backlog: 5 User Stories

### User Story 1: Browse Menu & View Prices
- **Story Statement:**  
  *As a* hungry customer,  
  *I want to* view a list of food items with their names, descriptions, emojis, categories, and prices,  
  *So that* I can quickly decide what food I want to order.
- **Priority:** High (Must Have)
- **Story Points:** 3
- **Acceptance Criteria (Given-When-Then):**
  - **AC 1.1:** *Given* the user opens the application on `http://localhost:3000`, *When* the homepage loads, *Then* a grid of food items must be displayed showing dish name, description, price, and category badge.
  - **AC 1.2:** *Given* the food menu is loaded, *When* the user clicks a category filter (e.g., Burgers, Pizzas, Desserts), *Then* only items belonging to that category should be shown.

---

### User Story 2: Select Items & Adjust Quantities
- **Story Statement:**  
  *As a* customer,  
  *I want to* add items to my cart and increase or decrease item quantities,  
  *So that* I can customize how many portions of each dish I wish to buy.
- **Priority:** High (Must Have)
- **Story Points:** 3
- **Acceptance Criteria (Given-When-Then):**
  - **AC 2.1:** *Given* a food card on screen, *When* the user clicks the `+` button, *Then* the item quantity increases by 1 and appears in the cart sidebar.
  - **AC 2.2:** *Given* an item with quantity 1 in the cart, *When* the user clicks the `−` button, *Then* the quantity drops to 0 and the item is cleanly removed from the cart.
  - **AC 2.3:** *Given* an empty cart, *When* no items are selected, *Then* the "Place Order" button must remain disabled to prevent submitting empty orders.

---

### User Story 3: Real-Time Dynamic Bill Calculation
- **Story Statement:**  
  *As a* customer,  
  *I want to* see an immediate, transparent breakdown of subtotal, tax (5%), delivery fees, and grand total,  
  *So that* I know the exact cost of my order before making a commitment.
- **Priority:** High (Must Have)
- **Story Points:** 5
- **Acceptance Criteria (Given-When-Then):**
  - **AC 3.1:** *Given* one or more items in the cart, *When* item quantities change, *Then* the Subtotal must immediately update to `Sum(price × quantity)` rounded to 2 decimal places.
  - **AC 3.2:** *Given* a valid subtotal, *When* tax is calculated, *Then* exactly 5% sales tax must be added to the breakdown.
  - **AC 3.3:** *Given* an order with a subtotal under $30.00, *When* the delivery fee is calculated, *Then* a standard $3.99 delivery fee is applied.
  - **AC 3.4:** *Given* an order with a subtotal equal to or greater than $30.00, *When* calculated, *Then* the delivery fee becomes $0.00 (FREE delivery) and a congratulatory badge appears.

---

### User Story 4: Place Order & View Order Confirmation
- **Story Statement:**  
  *As a* customer,  
  *I want to* submit my contact details, delivery address, and place my order,  
  *So that* I receive an official order confirmation receipt with an estimated delivery time.
- **Priority:** High (Must Have)
- **Story Points:** 5
- **Acceptance Criteria (Given-When-Then):**
  - **AC 4.1:** *Given* items in the cart, *When* the user fills in their Name, Address, and Phone and clicks "Place Order", *Then* a `POST /api/order` request is sent to the backend.
  - **AC 4.2:** *Given* a valid order submission, *When* the server confirms the order, *Then* a modal popup displays a unique Order ID (`ORD-XXXXXX-XXX`), customer address, itemized breakdown, total paid, and estimated delivery time (35 mins).
  - **AC 4.3:** *Given* the confirmation modal is open, *When* the user clicks "Order Something Else", *Then* the cart and form are reset and the modal closes.

---

### User Story 5: Automated Testing, Code Quality & CI/CD Pipeline
- **Story Statement:**  
  *As a* developer and DevOps engineer,  
  *I want to* have automated unit tests, static code quality checks, and an automated Jenkins CI/CD pipeline,  
  *So that* every change is automatically built, tested, validated, and deployed without manual human error.
- **Priority:** High (Must Have)
- **Story Points:** 8
- **Acceptance Criteria (Given-When-Then):**
  - **AC 5.1:** *Given* core pricing and validation functions, *When* `npm test` is executed, *Then* all 14 unit test cases must pass with 0 failures.
  - **AC 5.2:** *Given* project source code, *When* `npm run quality` is executed, *Then* JavaScript syntax, file structure, and coding standards are validated.
  - **AC 5.3:** *Given* a Jenkinsfile with 5 stages (GitHub Checkout, Build, Automated Testing, Code Quality Check, Deployment), *When* a pipeline build is triggered, *Then* all 5 stages execute sequentially, achieve green status, and the app is verified alive on `http://localhost:3000`.

---

## 3. Sprint Planning

| Sprint | Goal / Focus | User Stories Covered | Estimated Story Points | Deliverable |
| :--- | :--- | :--- | :--- | :--- |
| **Sprint 1** | Core UI, Menu Catalog & Real-Time Price Engine | Story 1, Story 2, Story 3 | 11 pts | Working frontend with menu browsing, quantity controls, and live cart calculation. |
| **Sprint 2** | Order Processing, Automated Testing & Jenkins CI/CD | Story 4, Story 5 | 13 pts | Order confirmation modal, 14 automated unit tests, code quality script, and 5-stage Jenkinsfile pipeline. |

---

## 4. Definition of Done (DoD)
A User Story is considered **"Done"** only when all of the following criteria are met:
1. **Coding Standard:** Clean JavaScript adhering to ES6+ standards with zero syntax errors.
2. **Automated Unit Tests:** Unit tests written covering normal and edge cases, passing with 100% success rate (`npm test`).
3. **Static Analysis:** Code passes all automated quality checks with 0 warnings/failures (`npm run quality`).
4. **Version Control:** Source code staged, committed, and pushed to the Git repository.
5. **CI/CD Automation:** Jenkins pipeline executes all 5 stages (Checkout, Build, Test, Quality Check, Deploy) with a **SUCCESS** status.
6. **Live Verification:** Application responds successfully with HTTP 200 at `http://localhost:3000` and `http://localhost:3000/api/health`.
