# Meta Graph API Integration Guide

## Overview

This guide outlines the complete process of setting up Meta Graph API integration to manage multiple Facebook pages, generate access tokens, and automate commenting and engagement through Zapier. The workflow involves creating business applications, generating system user tokens, converting them to page access tokens, and automating content posting through Postman and Zapier.

---

## Step 1: Admin Setup and Initial Configuration

### Prerequisites
- Admin access to all Facebook pages you want to manage
- Meta Business Manager account
- Access to Meta Developer Portal

### Process

This administrative access is essential for creating applications and managing tokens for those pages.

---

## Step 2: Creating Business Apps for Each Website

### In Meta Graph API Explorer

1. Access the **Meta Developer Portal** and navigate to **My Apps**
2. Create a new application for each website that needs integration
3. Select **Business** as your app type
4. Configure the app with appropriate display name and business purpose

### Obtaining the Page ID

To retrieve the Page ID from Facebook:

1. Go to your **Facebook Page Settings**
2. Navigate to the **About** tab
3. Scroll down to find your **Page ID** (it's a unique numerical identifier)
4. Copy and save this Page ID securely.

---

## Step 3: Adding Necessary Credentials to the App

When creating an app inside Meta Graph API, you will need to configure the following credentials:

<img width="1236" height="607" alt="Screenshot 2025-07-03 at 14-03-46 Allyou-7-2-2025-App - App settings - Meta for Developers" src="https://github.com/user-attachments/assets/cbe267bc-dbbb-49e2-ace8-086552af935a" />

<img width="1193" height="564" alt="Screenshot 2025-07-03 at 14-04-15 Allyou-7-2-2025-App - App settings - Meta for Developers" src="https://github.com/user-attachments/assets/bc464c2b-d324-4bc7-ae7b-de4ac37cd96c" />

<img width="1290" height="435" alt="Screenshot 2025-07-03 at 14-04-28 Allyou-7-2-2025-App - App settings - Meta for Developers" src="https://github.com/user-attachments/assets/d0bcef76-303a-44e4-b393-d3ceabe16495" />


Key credentials required:
- **App ID:** Unique identifier for your application
- **App Secret:** Confidential key for server-to-server communication
- **Client Token:** Used for non-authenticated requests
- **Business Account:** Associated business account information

These credentials should be securely stored and never exposed.

---

## Step 4: Repeat for All Websites

The same process outlined in Steps 2-3 was completed for all websites requiring Facebook page integration. Each website receives its own dedicated Meta business app with corresponding credentials and page IDs.

---

## Step 5: Generating System User Token (Page Access Token)

### Accessing Meta Business Manager

1. Log in to **Meta Business Manager**
2. Navigate to **Business Settings** → **Users** → **System Users**
3. Create or select an existing system user

### Creating the System User Token

According to current Meta Graph API best practices:

**Important Update:** While you may generate a system user token initially, Facebook's current requirements for posting comments on pages typically mandate using a **Page Access Token** rather than a System User token.

**Key Points:**
- **System User tokens** are primarily designed for Business Manager tasks such as managing catalogs, ads, and commerce operations
- **Page Access tokens** are required for posting comments, managing page content, and handling page-specific engagement
- Even if your system user token possesses the `pages_manage_posts` scope, Meta often requires you to specifically generate and use the Page's dedicated access token

### Obtaining the Page Access Token from System User

To convert your system user token to page-specific access tokens:

1. In **Meta Business Manager**, ensure the system user is assigned to each page with appropriate tasks:
   - "Content Creation"
   - "Moderation"
   - "Publish"
   - "Manage Engagement"

2. Generate the system user token after assigning these permissions

3. Use this token to retrieve page access tokens via the Graph API endpoint:
   ```
   GET https://graph.facebook.com/v16.0/me/accounts?access_token={YOUR_SYSTEM_USER_TOKEN}
   ```

4. The response will contain access tokens for each page the system user has access to

---

## Step 6: Converting System User Token to Page Access Token via Postman

### Setting Up Postman

After obtaining your temporary system user token from Meta Business Manager, you'll use Postman to convert it and retrieve all page access tokens.

<img width="1541" height="452" alt="Postman-Api-Call" src="https://github.com/user-attachments/assets/ccfa8c18-bc04-436d-add5-b37238225b96" />

### API Call Process

1. **Open Postman** and create a new GET request
2. **Enter the endpoint:**
   ```
   https://graph.facebook.com/v16.0/me/accounts?access_token={YOUR_SYSTEM_USER_TOKEN}
   ```
3. **Replace** `{YOUR_SYSTEM_USER_TOKEN}` with your actual system user token
4. **Send the request**
5. **Extract** the page access tokens from the response for each page

The response will contain all page-specific access tokens in a single call, providing you with the credentials needed for page-level operations on all managed pages.

---

## Step 7: Testing with Postman - First Comment

### Verification Test

Once you have obtained the page access tokens, conduct a verification test to ensure proper configuration:

<img width="685" height="652" alt="Postman-Test-Comment" src="https://github.com/user-attachments/assets/d2c3325b-cffa-412d-9420-bfd8df5f634f" />


### Test Comment Process

1. **Prepare your test data:**
   - Page ID (from Step 2)
   - Page Access Token (from Step 6)
   - Post ID from your target Facebook page

2. **In Postman, create a POST request:**
   ```
   POST https://graph.facebook.com/v16.0/{POST_ID}/comments?access_token={PAGE_ACCESS_TOKEN}
   ```

3. **Add the comment body in the request parameters:**
   ```
   message=Test comment from Postman
   ```

4. **Send the request** and verify successful posting

The test was successfully completed, confirming that the authentication and authorization configuration is working correctly.

---

## Step 8: Zapier Integration for Automated Posting

### Setting Up the Automation Workflow

With verified credentials in place, the automation workflow was implemented using Zapier to manage content posting across multiple pages.

### Phase 1: Data Collection from Google Sheets

1. **Trigger:** Set up a Google Sheets trigger in Zapier
2. **Data columns required:**
   - **Post ID:** The unique identifier for the Facebook post
   - **Post Link:** Direct link to the Facebook post
   - **Article Link:** The URL of the article or content to be shared

3. **Configure the trigger** to activate when new rows are added or updated in your Google Sheet

### Phase 2: Processing and Posting Comments

1. **Create a script using Code By Zapier and add in the input value the post id from the google sheet trigger and the page acess token.

### Results

The automation successfully posted corresponding links in corresponding posts. Each article link from the Google Sheet was posted as a comment to its designated Facebook post through the Zapier workflow.

---

## Step 9: Presentantion and Showcase

After successfull testing during the process, the implemantation was finally integrated at the facebook post:

<img width="697" height="533" alt="Facebook-First-Comment" src="https://github.com/user-attachments/assets/958b4122-63a3-4d20-bbc0-1f0f44dbd98f" />

## Conclusion

This integration workflow provides a scalable, automated solution for managing content across multiple Facebook pages. By combining Meta's Graph API with Zapier's automation platform and Google Sheets as a data source, organizations can efficiently manage page engagement while maintaining professional content standards.

For the latest Meta API documentation and updates, visit the [Meta Developer Portal](https://developers.facebook.com/).
