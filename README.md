# saucedemo-UI-Automation

## Project Overview

This project demonstrates automated UI testing for the [saucedemo](https://www.saucedemo.com/) using Playwright, Typescript, and GithubActions with a Playwright Ctrf Reporter.

The project tests the following features:
- Login
- Inventory
- Cart
- Checkout

## Prerequisites
- Nodejs latest version or one version lower than the latest,
- Playwright latest version or one version lower than the latest,
- Github to run github Actions,
- Playwright Ctrf Reporter for Displaying reports within Github,
- Typescript,
- Playwright Browsers(Chromium, Firefox & Webkit(Safari) ),
- Vscode or any other IDE that supports Node apps/projects.

## Project Structure
```
```
## Setup Instructions
### Clone the Repository
```bash
git clone 'https://github.com/Theofylrx/saucedemo-UI-Automation'
cd saucedemo-UI-Automation
```
### Download dependencies base on the package-lock.json
```bash
npm ci
```
## Run tests locally on the following playwright browsers:
### chromium
```bash
npm run test:saucedemo-chromium
```
### firefox
```bash
npm run test:saucedemo-firefox
```
### safari
```bash
npm run test:saucedemo-safari
```
### chromium ui-mode
```bash
npm run debug:saucedemo-chromium
```
### firefox ui-mode
```bash
npm run debug:saucedemo-chromium
```
### safari ui-mode
```bash
npm run debug:saucedemo-chromium
```
## Running tests on CI

For each change made, committed and pushed to main on github, the tests get triggered automatically and start running. When tests are done running a report is created and displayed on the pipeline itself.

View the github flows on this project for better understanding the setup.

here's a snippet example:
```bash
name: Chrome > Saucedemo UI Playwright Tests with Typescript
on:
  push:
    branches: 
      - main
permissions:
  contents: write
  issues: write
  statuses: write
  deployments: write
jobs:
  run-ui-tests:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        shardIndex: [1, 2, 3, 4]
        shardTotal: [4]

    container:
      image: mcr.microsoft.com/playwright:v1.52.0-jammy

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: lts/*
    - name: Install dependencies
      run: npm ci
    - name: Run Playwright tests
      uses: ./.github/actions/run-playwright-tests
      with:
        environment: 'DEMO'
        tag: "@critical"
        browser: "chromium"
        shardIndex: ${{ matrix.shardIndex }}
        shardTotal: ${{ matrix.shardTotal }}

  merge-reports:
    needs: [run-ui-tests]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: lts/*

      - name: Install dependencies
        run: npm ci

      - name: Download All Reports
        uses: actions/download-artifact@v4
        with:
          path: all-reports
          pattern: saucedemo-report-*
          merge-multiple: false

      - name: Merge All CTRF Test Summary Results
        shell: bash
        run: |
          mkdir -p ctrf-reports
          find all-reports/saucedemo-report-*/test-results -name 'ctrf-report.json' | while read file; do
            cp "$file" "ctrf-reports/$(basename $(dirname $(dirname $file)))-ctrf-report.json"
          done
          npx merge-ctrf ctrf-reports

      - name: Publish CTRF Test Summary Results
        shell: bash
        run: npx github-actions-ctrf ctrf-reports/ctrf-report.json
        if: always()
```
on the above snippet of our YML Github Actions workflow we have the following:
```
- Name of the pipeline,
- Triggers to run the pipeline,
- permissions,
- jobs
  - run-ui-tests
  - merge-reports
```

## Jobs
#### run-ui-tests >
This job sets up the container to run the tests on, then checks-out the repo with the tests then sets up node, installs the dependencies required to run the tests then goes ahead and runs the tests.
#### merge-reports >
This job waits for run-ui-tests job to finish running, then goes installs required dependencies to merge reports, then downloads all reports uploaded in a specific folder, merges them into a ctrf report and publishes them so that they are visible within the Github actions report when the tests are done running, whether failing or passing.