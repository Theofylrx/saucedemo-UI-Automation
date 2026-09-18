# **Skills Test: Test Platform & QA Engineering**

**Role:** Software Engineering, Test Platform and QA

**Objective:** This exercise aims to evaluate your technical proficiency in designing and implementing robust test automation frameworks. We are looking for candidates who can demonstrate strong coding practices, architectural thinking for reusability and maintainability, and a clear understanding of the strengths and weaknesses of different testing platforms.

**Scenario:** You will be building automated test solutions against a publicly available, stable, and simple e-commerce website: [`https://www.saucedemo.com/`](https://www.saucedemo.com/)

**Test Outcomes & Deliverables:**

Your submission should demonstrate your ability to:

1. **Design a Core Test Library:** Create reusable and well-structured test library components for common functionalities encountered on `saucedemo.com`. A key example is a login mechanism (e.g., encapsulating the steps to log in with a given username and password). These libraries should promote reusability across multiple tests.

2. **Develop a Functional Test Suite:** Build a comprehensive test suite that specifically validates the functionality of adding items to the shopping cart and completing the checkout process on `saucedemo.com`. This suite should leverage the core test libraries you've developed.

3. **Add API Testing Support:** Extend the framework to support API-level testing. Demonstrate how your platform can execute and validate HTTP-based API tests. Include at least one example API test that shows how API and UI tests can coexist and share utilities within the same framework.

4. **Add Database Testing Support:** Extend the framework to support database-level validation. Demonstrate how your platform can connect to and query a database (e.g., PostgreSQL, MySQL, or SQLite) to assert on data state — for example, verifying that a completed order is persisted correctly.

> **Note:** The target site ([`https://www.saucedemo.com/`](https://www.saucedemo.com/)) does **not** expose a public API or database. These requirements are intentionally open-ended: we want to see how you design a framework that is *capable* of supporting API and database testing. You are free to mock, stub, or stand up your own sample API/database to demonstrate the framework's capabilities — the focus is on the architecture and extensibility, not on testing saucedemo.com's (non-existent) backend.

5. **Document Your Use of AI:** We actively encourage the use of AI tools for this exercise. In return, we ask you to be transparent about how you used them. Include an `AI_NOTES.md` file in your repository that honestly describes how AI assisted your work — for example, which tools you used, what you used them for (scaffolding, debugging, test generation, documentation, etc.), what you accepted or rejected, and where you applied your own judgement. There is no penalty for using AI heavily; we simply value honesty and your understanding of the resulting solution.

**Important Implementation Requirements:**

* **Playwright with TypeScript**

    * **Core Library:** Implement the common functionalities (e.g., login) as reusable TypeScript functions or classes using Playwright. Ideally this is something that can be packaged and deployed to a company NPM repository as [GCP Artifact Registry](https://cloud.google.com/artifact-registry/docs).
    * **Test Suite:** Develop the add-to-cart and checkout tests using Playwright in TypeScript, leveraging your core library. Add as many tests as you feel is a reasonable use of your time to demonstrate your proficiency.
    * **API Testing:** Integrate API tests into the same framework. These should be runnable alongside or independently of UI tests, with shared configuration and utilities where applicable.
    * **Database Testing:** Integrate database assertions into the framework. Provide a clear pattern for setting up a DB connection, running queries, and tearing down state — demonstrating how end-to-end data integrity can be verified.

**Code Quality & Visibility:**

* All code for this exercise **must be open-sourced** in your git repository.
* We expect to see **regular, meaningful commits** throughout your development process. This allows us to observe your iterative approach, thought process, and commitment to version control best practices.
* Organize your repository and code in a logical and professional manner, demonstrating good software engineering principles (e.g., clear folder structure, meaningful variable names, appropriate comments where necessary, use of build tools if applicable).

**Evaluation Criteria:**

* **Technical skills**
    * **Problem-Solving & Efficiency:**
        * Elegant solutions to common automation challenges (e.g., element locators, waiting strategies).
        * Efficiency of the implemented tests.
    * **Technical Proficiency (Coding):**
        * Correctness and functionality of the tests.
        * Adherence to best practices.
        * Effective use of Playwright APIs.
        * Quality and design of API and database test utilities.
    * **Software Design & Architecture:**
        * Clean separation of concerns.
        * Scalability considerations for future test growth.
        * Readability and organization of the codebase.
        * Modularity, reusability, and maintainability of the core test libraries.
    * **Version Control & Documentation:**
        * Consistent and meaningful commit history.
        * Clear README files in your repositories explaining how to set up and run the tests.

**Instructions:**

* You are free to use any build tools, libraries and frameworks you deem appropriate. We are looking to measure your decision process in selecting and using tools.
* You are free to use Google search, books, AI coding assistants, and any other resources that you want to, but be aware that you will be judged heavily on your understanding of your solution. **We allow and encourage the use of AI for this task.**
* If you use AI, please be honest about it by including an `AI_NOTES.md` file describing how you used it (see deliverable 5 above).
* Ensure your README provides clear instructions on how to set up dependencies and run your tests.
* Feel free to add any additional comments or explanations in your repository README that you believe will enhance our understanding of your work.

## CodeSubmit

Please organize, design, test, and document your code as if it were
going into production - then push your changes to the master branch.

Have fun coding! 🚀