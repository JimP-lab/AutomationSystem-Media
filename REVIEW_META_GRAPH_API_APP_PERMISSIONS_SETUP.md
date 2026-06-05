# Meta Graph API - App Permissions & Rights Configuration

**Purpose:** This document explains how to configure app permissions in Meta Graph API after app creation, ensuring the app has access to all required page rights for integration.

---

## Understanding App Permission Hierarchy

When you create an app in Meta Graph API, the app itself must be granted permissions to interact with your pages. This is separate from user permissions. Think of it as:

**App Permissions = What the app is allowed to do**  
**User/System User Permissions = Which users/system users can authorize the app**

Both must be configured for full integration capability.

---

## Step A: Configuring App Roles and Permissions in Meta Developer Portal

### Step A.1: Access Your App Settings

1. Navigate to **Meta Developer Portal:** https://developers.facebook.com/apps/
2. Click on your app name (e.g., "AllYou-Integration")
3. In the left sidebar, go to **Settings** → **Basic**
4. Ensure your app is in **Development** or **Live** mode (Development for testing)

### Step A.2: Define App Roles

1. From the app dashboard, navigate to **Roles** → **App Roles**
2. Here you'll see different role categories:
   - **Admins** - Full control over the app
   - **Developers** - Can modify settings and test
   - **Testers** - Can test the app

3. Add team members or system users to appropriate roles:
   - Click **Add App Role**
   - Enter the user's email or system user ID
   - Select the role level
   - Click **Add**

**[Placeholder for App Roles Configuration Screenshot - Image A1: Show app roles assignment panel]**

### Step A.3: Configure App Permissions (Scopes)

This is the critical step where you grant the app access to page functions.

1. Navigate to **Settings** → **Basic** in your app dashboard
2. Scroll down to **App Roles** and locate **Scopes**
3. Under **Permissions**, you'll see available scopes organized by category:

**Required Scopes for Page Management:**

| Scope | Purpose | Required? |
|-------|---------|-----------|
| `pages_manage_posts` | Post content to pages | ✅ Yes |
| `pages_manage_engagement` | Manage comments and reactions | ✅ Yes |
| `pages_read_engagement` | Read page engagement data | ✅ Yes |
| `pages_show_list` | View list of managed pages | ✅ Yes |
| `business_management` | Access business assets | ✅ Yes |
| `pages_read_user_content` | Read user-generated content | Optional |
| `page_events` | Access page events | Optional |

**Steps to Grant Scopes:**

1. Click **Add Scope**
2. Search for each required scope
3. Check the box for the scope
4. Click **Add Scope** to confirm
5. Repeat for all required scopes

**[Placeholder for Scopes Configuration Screenshot - Image A2: Show scope selection and granting panel]**

---

## Step B: Assigning App to Pages in Business Manager

### Step B.1: Connect App to Business Manager

1. Go to **Meta Business Manager:** https://business.facebook.com/
2. Navigate to **Settings** → **Apps**
3. Click **Add Apps**
4. Search for your app by name or App ID
5. Click **Add** next to your app name

**[Placeholder for Add App to Business Manager Screenshot - Image B1: Show app selection in Business Manager]**

### Step B.2: Grant App Access to All Pages

Once the app is added to Business Manager:

1. In **Business Manager** → **Settings** → **Apps**, click on your app
2. Navigate to the **Assigned Assets** or **Page Access** section
3. Click **Add Pages**
4. **Select all pages** you want the app to manage:
   - ☑ AllYou.gr
   - ☑ Avopolis
   - ☑ Additional Page 1
   - ☑ Additional Page 2
   - ☑ (Any other pages)

5. For each page, verify the access level is set to **Admin** or **Full Control**
6. Click **Save** or **Assign**

**[Placeholder for Page Assignment Screenshot - Image B2: Show pages being assigned to the app]**

---

## Step C: Linking App to System User

### Step C.1: Access System User Settings

1. In **Meta Business Manager** → **Settings** → **System Users**
2. Click on the system user you created (or want to configure)

### Step C.2: Assign App to System User

1. On the system user's page, locate **Apps and Websites** section
2. Click **Add Apps**
3. Search for your app by name (e.g., "AllYou-Integration")
4. Click **Add**

**[Placeholder for App Assignment to System User Screenshot - Image C1: Show system user app assignment]**

### Step C.3: Configure App Permissions for System User

After adding the app to the system user:

1. Click on the app name to open its settings
2. You'll see a permissions panel with checkboxes for:
   - **Manage Pages**
   - **Manage Analytics**
   - **Manage Content Creation**
   - **Manage Engagement**
   - **Publish to Page**
   - **Manage Moderation**

3. **Enable all required permissions:**
   - ✅ Manage Pages
   - ✅ Manage Content Creation
   - ✅ Publish to Page
   - ✅ Manage Engagement
   - ✅ Manage Moderation

4. Click **Save Changes**

**[Placeholder for System User App Permissions Screenshot - Image C2: Show permissions configuration for the app]**

### Step C.4: Verify Page-Level Access

Ensure the system user has access to each page:

1. Still in the system user's settings
2. Navigate to **Pages** section
3. Verify all pages are listed:
   - AllYou.gr
   - Avopolis
   - Additional pages...

4. For each page, verify the role/permissions are set to **Admin** or **Full Access**
5. If pages are missing, click **Assign Pages** and select them manually

**[Placeholder for System User Page Access Screenshot - Image C3: Show all pages assigned to the system user]**

---

## Step D: Testing App Permissions

### Step D.1: Verify in Graph API Explorer

1. Go to **Meta Graph API Explorer:** https://developers.facebook.com/tools/explorer/
2. In the top dropdown, select your app
3. Run the following test calls:

**Test Call 1: Check App Access**
```
GET /me/accounts
```
Response should show all pages the app has access to.

**Test Call 2: Check Page Permissions**
```
GET /{PAGE_ID}?fields=id,name
```
Replace `{PAGE_ID}` with an actual page ID. Should return page details.

**Test Call 3: Check Post Access**
```
GET /{PAGE_ID}/posts?limit=5
```
Should return recent posts from that page.

4. If any call fails, go back and verify permissions are correctly assigned

**[Placeholder for Graph API Explorer Test Screenshot - Image D1: Show successful API test responses]**

### Step D.2: Generate and Test System User Token

1. In **Meta Business Manager** → **System Users**
2. Select your system user
3. Click **Generate Access Token**
4. Copy the token
5. In **Postman**, create a GET request:
   ```
   https://graph.facebook.com/v22.0/me/accounts?access_token={YOUR_TOKEN}
   ```
6. Send the request
7. Verify the response includes all your pages with their access tokens

---

## Step E: Permission Verification Checklist

Before moving forward with the integration, verify:

### ✅ In Meta Developer Portal
- [ ] App is created and in Development/Live mode
- [ ] All required scopes are granted to app:
  - [ ] `pages_manage_posts`
  - [ ] `pages_manage_engagement`
  - [ ] `pages_read_engagement`
  - [ ] `pages_show_list`
  - [ ] `business_management`

### ✅ In Meta Business Manager
- [ ] App is added to Business Manager
- [ ] App has access to all required pages
- [ ] System user is created
- [ ] System user is assigned the app
- [ ] System user has the following permissions enabled:
  - [ ] Manage Pages
  - [ ] Manage Content Creation
  - [ ] Publish to Page
  - [ ] Manage Engagement
  - [ ] Manage Moderation
- [ ] System user has access to all required pages with Admin/Full Access role

### ✅ In Graph API
- [ ] GET /me/accounts returns all pages
- [ ] GET /{PAGE_ID} returns page details
- [ ] GET /{PAGE_ID}/posts returns recent posts
- [ ] System User token generates successfully

---

## Troubleshooting Permission Issues

### Issue: "Insufficient Permissions" Error

**Cause:** App or system user missing required scopes

**Solution:**
1. Go back to **Settings** → **Basic** in your app
2. Verify all required scopes are checked
3. Regenerate system user token after adding scopes
4. Test with new token

### Issue: Pages Not Appearing in API Response

**Cause:** Pages not assigned to app or system user

**Solution:**
1. In **Business Manager** → **Settings** → **Apps**, verify pages are assigned
2. In **Business Manager** → **Settings** → **System Users**, verify system user can access pages
3. Repeat assignment process if needed

### Issue: Can Retrieve Posts but Cannot Post Comments

**Cause:** Missing `pages_manage_engagement` or `pages_manage_posts` scope

**Solution:**
1. Add missing scopes in app settings
2. Regenerate system user token
3. Test posting in Postman again

---

## Reference URLs for Permission Setup

- **Meta Developer Portal - Apps:** https://developers.facebook.com/apps/
- **Meta Business Manager - Apps:** https://business.facebook.com/latest/settings/apps?business_id=127715351554035
- **Meta Business Manager - System Users:** https://business.facebook.com/latest/settings/system_users?business_id=127715351554035
- **Graph API Explorer:** https://developers.facebook.com/tools/explorer/

---

## Important Notes

1. **Permissions Must Match:** The scopes in the app must match the permissions in the system user. If one is missing, the integration won't work.

2. **Token Expiration:** System user tokens expire approximately every 60 days. You'll need to regenerate them periodically and update Zapier/Postman with new tokens.

3. **Security:** Never share app credentials or access tokens. Treat them like passwords.

4. **Multiple Apps:** If managing multiple websites, repeat this entire process (Steps A-E) for each app.

---

**Proceed to Main Guide:** Once you've completed and verified all permission steps above, you're ready to move forward with the main Meta Graph API Integration Guide steps (Token Generation, Postman Testing, Zapier Automation, etc.).

---

## FOR REVIEW

This chapter is **FOR REVIEW ONLY** and will be integrated into the main `META_GRAPH_API_INTEGRATION_GUIDE_UPDATED.md` after your approval.

**Click "Allow" to approve this content for integration into the main guide, or "Dismiss" to request modifications.**

