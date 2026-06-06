# Meta Graph API Integration Guide

## Overview

This guide covers the complete process for setting up a Meta Graph API integration to manage multiple Facebook pages, generate access tokens, and automate first-comment posting through Zapier. The workflow involves creating a business application, configuring system user permissions, generating page access tokens, and connecting everything through an automated Zapier pipeline.

## Step 1: Admin Setup and Initial Configuration

### Prerequisites

Before starting, ensure the following are in place:

- Meta Business Manager account with admin access
- Admin rights on all Facebook pages requiring integration
- Access to Meta Developer Portal

### Adding Team Members as Page Admins

The recommended way to manage admin access across multiple pages is through Meta Business Manager, which handles all pages centrally from one place.

1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Navigate to **Settings** → **Business Users**
3. Click **Add** and enter the person's business email
4. Select role: **Admin**
5. Assign to all pages that require integration
6. Click **Send Invite**

The invited person will receive an email to accept the admin role before access is granted.

**Reference:** [Meta Business Manager – Business Users](https://business.facebook.com/latest/settings/business_users?business_id=127715351554035)

## Step 2: Creating a Business App

A dedicated Meta business app is required for each website to keep credentials and permissions clearly separated. The following steps walk through the full app creation process.

### Step 2.1 – Create the App

1. Go to [Meta Developer Portal](https://developers.facebook.com/apps/) and click **Create App**
2. Select **Business** as the app type
3. Enter a descriptive app name (e.g., `AllYou-Integration`) and a business contact email
4. Click **Create App**

### Step 2.2 – Copy App Credentials

Once the app is created, go to **Settings** → **Basic** to find the following credentials:

| Credential | Description |
|---|---|
| **App ID** | Unique identifier for the application |
| **App Secret** | Confidential key used for server-to-server communication — never expose publicly |
| **Client Token** | Used for non-authenticated requests |

The screenshots below show the credential fields as they appear in the app settings panel:
<img width="1236" height="607" alt="Screenshot 2025-07-03 at 14-03-46 Allyou-7-2-2025-App - App settings - Meta for Developers" src="https://github.com/user-attachments/assets/4507e49f-9dcb-487d-8b82-0e61812a7997" /> 
<img width="1193" height="564" alt="Screenshot 2025-07-03 at 14-04-15 Allyou-7-2-2025-App - App settings - Meta for Developers" src="https://github.com/user-attachments/assets/491c6504-3a4e-47d9-8abd-bf31cbbfc0cb" />
<img width="1290" height="435" alt="Screenshot 2025-07-03 at 14-04-28 Allyou-7-2-2025-App - App settings - Meta for Developers" src="https://github.com/user-attachments/assets/7e97bf3f-8430-43ba-9108-dd67d66f9650" />

Store all credentials securely. Repeat this step for each website that requires a separate integration.

**Reference:** [Meta Developer Portal – Apps](https://developers.facebook.com/apps/)


## Step 3: Obtaining Page IDs

Each Facebook page has a unique numerical ID required for API calls. Facebook no longer displays the Page ID prominently in the page settings, so the following methods are the current reliable approaches.

### Method 1 – Via Meta Business Manager (Recommended)

1. Go to [Meta Business Manager](https://business.facebook.com/)
2. Navigate to **Business Settings** → **Pages**
3. Click on the page — the **Page ID** is displayed in the page details panel

### Method 2 – Via Graph API Explorer

1. Open [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown
3. Change the request path from `/me` to `/YourPageName`
4. Click **Submit**
5. Locate the `"id"` field in the response — this is your Page ID

Collect the Page ID for every page you plan to integrate before proceeding.

**Reference:** [Meta Business Manager – Pages](https://business.facebook.com/latest/home?asset_id=1501100376789442&nav_ref=bm_home_redirect&business_id=127715351554035)


## Step 4: Configuring the App and System User

This step connects all components together: the app is added to Business Manager, scopes are defined, a system user is created, and both pages and the app are assigned to that user with the correct permissions. All of this must be completed before generating a token.

### 4.1 – Add the App to Business Manager

This must happen before the app can be assigned to a system user.

1. In [Meta Business Manager](https://business.facebook.com/) go to **Settings** → **Apps**
2. Click **Add Apps**, search by app name or App ID, and add it
3. In the app's **Assigned Assets**, click **Add Pages** and select all pages with **Admin / Full Control** access

**Reference:** [Meta Business Manager – Apps](https://business.facebook.com/latest/settings/apps?business_id=127715351554035&selected_asset_id=1495524101683056&selected_asset_type=app)

### 4.2 – Add Required Scopes to the App

In [Meta Developer Portal](https://developers.facebook.com/apps/) open your app, go to **Settings** → **Basic**, and add the following scopes:

| Scope | Purpose |
|---|---|
| `pages_manage_posts` | Post content to pages |
| `pages_manage_engagement` | Manage comments and reactions |
| `pages_read_engagement` | Read page engagement data |
| `pages_show_list` | View list of managed pages |
| `business_management` | Access business assets |

### 4.3 – Create a System User

1. In [Meta Business Manager](https://business.facebook.com/) go to **Settings** → **System Users**
2. Click **Create System User**
3. Enter a descriptive name (e.g., `AllYou-API-User`) and set the role to **Admin**
4. Click **Create System User**

### 4.4 – Assign Pages to the System User

1. On the system user's page, click **Assign Assets** → select **Pages**
2. Check all pages this user should manage
3. For each page, enable the following tasks:
   - ✅ Content Creation
   - ✅ Moderation
   - ✅ Publish
   - ✅ Manage Engagement
4. Click **Save**

> **Important:** These four page-level tasks must be enabled here. Without them, the Page Access Tokens generated in Step 6 will not carry sufficient permissions to post comments — even if the app scopes are correctly configured.

Once saved, verify that all pages appear in the system user's **Pages** section with **Admin** or **Full Access** status. If any page is missing, click **Assign Pages** and add it manually before continuing.

### 4.5 – Assign the App to the System User

1. Still on the system user's page, under **Apps** click **Add Apps**
2. Select your app (e.g., `AllYou-Integration`)
3. Enable the following permissions:
   - ✅ Manage Pages
   - ✅ Manage Content Creation
   - ✅ Publish to Page
   - ✅ Manage Engagement
   - ✅ Manage Moderation
4. Click **Save**

**Reference:** [Meta Business Manager – System Users](https://business.facebook.com/latest/settings/system_users?business_id=127715351554035&selected_user_id=61572720126064)


## Step 5: Generating a System User Token

With pages and the app fully assigned to the system user, the token can now be generated.

1. In [Meta Business Manager](https://business.facebook.com/) go to **Settings** → **System Users**
2. Select your system user and click **Generate Token**
3. In the window that appears, select your app from the dropdown
4. Choose a token expiration preference
5. Assign the required permissions for your use case
6. Click **Generate Token** and copy the token immediately — it will not be shown again

The token will appear in the format `EAAS...` and is valid for approximately 60 days. A new token can be generated at any time by repeating this process.

> **Note:** System User tokens are used exclusively to retrieve Page Access Tokens via the API. All page-level operations — posting, commenting, managing engagement — require Page Access Tokens, not the System User token directly.

**Reference:** [Meta Business Manager – System Users](https://business.facebook.com/latest/settings/system_users?business_id=127715351554035&selected_user_id=61572720126064)


## Step 6: Retrieving Page Access Tokens via Postman

The System User token is used in a single API call to retrieve the Page Access Token for every managed page at once.

1. Open [Postman](https://www.postman.com) and create a new **GET** request
2. Enter the following endpoint, replacing the placeholder with your actual token:

```
GET https://graph.facebook.com/v22.0/me/accounts?access_token={YOUR_SYSTEM_USER_TOKEN}
```

3. Click **Send**

The response returns an access token for each page the system user manages:

```json
{
  "data": [
    {
      "id": "1501100376789442",
      "name": "AllYou.gr",
      "access_token": "EAAS..."
    },
    {
      "id": "125340620853071",
      "name": "Avopolis",
      "access_token": "EAAS..."
    }
  ]
}
```

For each page, copy and securely store the **Page ID** and **Page Access Token**. These tokens expire in approximately 60 days. To renew them, generate a fresh System User token and repeat this call.

This same call can also be made directly in Graph API Explorer using the following path:

```
GET me/accounts?fields=id,name,access_token
```

**Reference:** [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=me%2Faccounts%3Ffields%3Did%2Cname%2Caccess_token&version=v22.0)


## Step 7: Testing – Posting a Comment via Postman

Before setting up the full Zapier automation, a manual test confirms that the Page Access Token is working correctly and that the integration is properly configured end to end.

### Preparing the Test

1. Open the target Facebook post and click the timestamp to open it directly
2. Copy the Post ID from the URL: `facebook.com/[PAGE]/posts/[POST_ID]`

### Creating the Request in Postman

1. Create a new **POST** request with the following endpoint:

```
POST https://graph.facebook.com/v22.0/{POST_ID}/comments?access_token={PAGE_ACCESS_TOKEN}
```

2. In the **Body** tab, select `form-data` and add:
   - Key: `message` | Value: `Test comment from Postman`
3. Click **Send**

A successful response returns:

```json
{ "id": "COMMENT_ID_12345" }
```

Navigate to the Facebook post and verify the comment appears posted under the page name. If the call fails, confirm the Post ID is correct and that the Page Access Token includes the `pages_manage_posts` scope.

The screenshot below shows the test comment as it appears on the Facebook post after a successful Postman call:

<img width="657" height="133" alt="Postman-Test-Comment" src="https://github.com/user-attachments/assets/3ad60b26-7c58-447c-b63f-61c2d1e7c024" />

### Repeat for All Websites

The process outlined in Steps 2 through 7 must be completed for each website requiring integration. Each website should have its own dedicated app to maintain a clear separation of credentials and permissions.

**Reference:** [Meta Developer Portal – Apps](https://developers.facebook.com/apps/)

## Step 8: Zapier Automation

With verified credentials in place, the automation workflow is implemented using Zapier to manage content posting across all pages on a recurring schedule.

### Phase 1 – Retrieve the Latest Facebook Posts

**Trigger:** Code by Zapier (Run JavaScript)

**Input values:**
- `pageId` — Facebook page ID
- `pageAccessToken` — Page access token

The script fetches the latest posts from each configured page, extracts post IDs, post links, and article links (from message text or post attachments), and automatically resolves shortened URLs such as `dlvr.it` to their original destination.

### Phase 2 – Store Data in Google Sheets

**Action:** Google Sheets – Create Spreadsheet Row

The following columns are populated from the Phase 1 output:

| Column | Source |
|---|---|
| **Post ID** | Unique identifier for the Facebook post |
| **Post Link** | Direct link to the Facebook post |
| **Article Link** | URL of the article or content associated with the post |

The trigger activates when a new row is added to the sheet.

### Phase 3 – Post the Article Link as the First Comment

**Action:** Code by Zapier (Run JavaScript)

**Input values mapped from the Google Sheets row:**
- `postId`
- `postLink`
- `articleLink`
- `pageAccessToken`

The script matches each article link to its corresponding Facebook post and posts it as the first comment using the following API call:

```
POST https://graph.facebook.com/v22.0/{POST_ID}/comments
Body: { message: "🔗 Read the full article here: {ARTICLE_LINK}" }
```

Comments are processed in batches of five with a five-second timeout per request to ensure reliable delivery.

> **Note – Optimization During Testing:** During the testing phases, several updates were applied to improve the workflow. The Phase 1 script was updated to retrieve posts from all pages associated with the integration rather than a single page, and the initial fetch limit of 10 posts per page was increased to 50 posts to provide broader content coverage per run. The Google Sheets trigger in Phase 2 was updated from **Create Spreadsheet Row** to **Create Multiple Spreadsheet Rows** to handle the higher volume efficiently. During this phase, a technical challenge was also identified in the Phase 3 script: the `Promise.all` function used for parallel processing was not correctly distributing comment posting across all pages, resulting in comments being posted to one page only instead of all configured pages. This is a known limitation documented here for reference in future implementations.

---

## Step 9: Presentation and Showcase

After successful testing during the process, the implementation was fully integrated and the article link appears automatically as the first comment on each corresponding Facebook post across all managed pages.

<img width="682" height="259" alt="Facebook-First-Comment" src="https://github.com/user-attachments/assets/c617078c-36d3-4a03-978f-5f26657d251f" />

## Conclusion

This integration workflow provides a scalable, automated solution for managing content across multiple Facebook pages. By combining Meta's Graph API with Zapier's automation platform and Google Sheets as a data source, organizations can efficiently manage page engagement while maintaining professional content standards.

For the latest Meta API documentation and updates, visit the [Meta Developer Portal](https://developers.facebook.com/).
