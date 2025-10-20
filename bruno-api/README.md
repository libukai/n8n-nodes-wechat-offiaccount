# WeChat Official Account API - Bruno Collection

Complete Bruno API collection for WeChat Official Account Platform (微信公众号), featuring all major API operations with automatic token management.

## 📋 Collection Structure

```
bruno-api/
├── bruno.json                  # Collection configuration
├── collection.bru              # Collection-level settings & documentation
├── environments/               # Environment configurations
│   ├── test.bru               # Test environment (safe to commit)
│   ├── production.bru         # Production (gitignored, real credentials)
│   ├── production.example.bru # Production template (safe to commit)
│   └── README.md              # Environment setup guide
├── 1-auth/                    # Authentication & Token Management
│   └── get-access-token.bru   # Obtain access_token manually
├── 2-user/                    # User Management (6 endpoints)
│   ├── get-user-info.bru      # Get user info (includes unionid)
│   ├── get-user-list.bru      # Get followers list
│   ├── update-user-remark.bru # Set user remark
│   ├── get-blacklist.bru      # Get blacklisted users
│   ├── batch-blacklist.bru    # Block users
│   └── batch-unblacklist.bru  # Unblock users
├── 3-user-tag/                # User Tagging System (3 core endpoints)
│   ├── create-tag.bru         # Create new tag
│   ├── get-tags.bru           # Get all tags
│   └── batch-tagging.bru      # Assign tags to users
├── 4-media/                   # Media Management (2 core endpoints)
│   ├── upload-temp-media.bru  # Upload temporary media (3-day validity)
│   └── get-temp-media.bru     # Download temporary media
├── 5-template/                # Template Messages (2 endpoints)
│   ├── send-template-message.bru  # Send template message
│   └── get-all-templates.bru      # Get all templates
├── 6-menu/                    # Custom Menu (3 endpoints)
│   ├── create-menu.bru        # Create/update menu
│   ├── get-menu.bru           # Get current menu
│   └── delete-menu.bru        # Delete menu
├── 7-comment/                 # Article Comments (placeholders)
├── 8-draft/                   # Draft Management (placeholders)
├── 9-publish/                 # Publishing (placeholders)
├── 10-sign/                   # Message Encryption (local utilities)
├── 11-other/                  # Other APIs (2 endpoints)
│   ├── generate-qrcode.bru    # Generate parametric QR codes
│   └── shorten-url.bru        # URL shortening service
└── README.md                  # This file
```

**Total:** 20+ working API requests across 11 modules

## 🚀 Quick Start

### 1. Open Collection in Bruno

```bash
# Navigate to project directory
cd /path/to/n8n-nodes-wechat-offiaccount

# Open Bruno and select the bruno-api folder
```

Or use Bruno CLI:
```bash
bruno open bruno-api
```

### 2. Set Up Environment

**For Testing:**
1. Select **test** environment from Bruno's dropdown
2. Edit `environments/test.bru` with your test credentials:
   ```
   appId: your_test_app_id
   appSecret: your_test_app_secret
   testOpenId: test_user_openid
   ```

**For Production:**
1. Copy the example file:
   ```bash
   cp bruno-api/environments/production.example.bru bruno-api/environments/production.bru
   ```

2. Edit `production.bru` with real credentials

3. Set `appSecret` in Bruno:
   - Select **production** environment
   - Click lock icon next to `appSecret`
   - Enter your real AppSecret

### 3. Test Your Setup

Run these requests in order:

1. **Get Access Token** (`1-auth/get-access-token.bru`)
   - Verifies credentials
   - Should return `access_token` and `expires_in: 7200`

2. **Get User List** (`2-user/get-user-list.bru`)
   - Returns follower count and OpenIDs
   - No additional setup needed

3. **Get User Info** (`2-user/get-user-info.bru`)
   - Requires valid `testOpenId` in environment
   - Returns user profile including `unionid` (if authorized)

## 🔐 Environment Variables

### Required Variables

| Variable | Description | Example | Secret? |
|----------|-------------|---------|---------|
| `baseUrl` | API base URL | `https://wxpublic.10k.xyz` | No |
| `appId` | WeChat Official Account AppID | `wx1234567890abcdef` | No |
| `appSecret` | WeChat AppSecret | `abc123xyz...` | **Yes** |
| `testOpenId` | Test user OpenID | `oABC123xyz...` | No |
| `accessToken` | Auto-generated token | (auto-set) | No |

### Where to Get Credentials

1. **Log in** to WeChat Official Account Platform: https://mp.weixin.qq.com
2. Navigate to: **设置与开发 → 基本配置** (Settings & Development → Basic Configuration)
3. Find:
   - **AppID** (开发者ID)
   - **AppSecret** (开发者密码) - Click "Reset" if needed
4. For **testOpenId**:
   - Go to **用户管理** (User Management)
   - Find a follower's OpenID
   - Or run `2-user/get-user-list.bru` to get OpenIDs

## 🔄 Automatic Token Management

**Most requests automatically fetch fresh access tokens!**

Each request includes a pre-request script that:
1. Calls `/cgi-bin/stable_token` with your `appId` + `appSecret`
2. Extracts `access_token` from response
3. Sets `{{accessToken}}` variable for the main request
4. Token valid for 7200 seconds (2 hours)

**You don't need to manually manage tokens** - they're refreshed automatically for each request.

### Manual Token Request

Use `1-auth/get-access-token.bru` to:
- Test credentials
- Manually obtain token
- Understand token structure
- Debug authentication issues

## 📚 API Modules Overview

### 1-auth: Authentication
- **get-access-token**: Obtain `stable_token` manually
- Token valid for 2 hours (7200 seconds)
- Rate limit: 1 request/second

### 2-user: User Management
- **get-user-info**: Get user profile (includes `unionid` if authorized)
- **get-user-list**: Get paginated follower list (10K per page)
- **update-user-remark**: Set custom remark for users
- **get-blacklist**: Get blocked users
- **batch-blacklist**: Block up to 20 users at once
- **batch-unblacklist**: Unblock up to 20 users at once

### 3-user-tag: User Tagging
- **create-tag**: Create new tag (max 100 per account)
- **get-tags**: List all tags
- **batch-tagging**: Assign tag to up to 50 users

### 4-media: Media Management
- **upload-temp-media**: Upload media (valid 3 days)
  - Supports: image, voice, video, thumb
  - Size limits: image/voice 2MB, video 10MB, thumb 64KB
- **get-temp-media**: Download media by `media_id`

### 5-template: Template Messages
- **send-template-message**: Send template message to user
  - Rate limit: 100K/day (base), increases with followers
  - Supports mini-program linking
  - Deduplication via `client_msg_id`
- **get-all-templates**: List all active templates (max 25)

### 6-menu: Custom Menu
- **create-menu**: Create/update custom menu
  - Max 3 first-level buttons
  - Max 5 sub-buttons per parent
  - 9 button types: click, view, miniprogram, scan, photo, location, etc.
- **get-menu**: Get current menu configuration
- **delete-menu**: Remove custom menu

### 11-other: Utility APIs
- **generate-qrcode**: Create parametric QR codes
  - Temporary (30-day expiration) or permanent
  - Scene parameter for tracking (integer or string)
  - Max 100K permanent QR codes per account
- **shorten-url**: URL shortening service
  - Max 4KB input
  - 30-day expiration

## 🧪 Testing & Validation

Each request includes:
- **docs block**: Inline documentation with parameters, examples, and notes
- **tests block**: Automated assertions using Chai
  - Status code validation
  - Response structure checks
  - Field type validation
- **post-response script**: Logging and variable extraction

### Run Tests
Bruno automatically runs tests after each request. Check the "Tests" tab for results.

### Common Test Patterns
```javascript
// Check success
test("errcode is 0", function() {
  expect(res.body.errcode).to.equal(0);
});

// Validate response structure
test("Response has required fields", function() {
  expect(res.body.data).to.exist;
  expect(res.body.data).to.be.an('object');
});

// Check data types
test("OpenID is string", function() {
  expect(res.body.openid).to.be.a('string');
});
```

## 🔒 Security Best Practices

### ✅ Safe to Commit
- `test.bru` - Test credentials only
- `production.example.bru` - Template without secrets
- All `.bru` request files
- `README.md` and documentation

### ⛔ Never Commit
- `production.bru` - **Already gitignored**
- Contains real `appSecret` in `vars:secret`

### 🔐 Credential Protection
1. **Use `vars:secret`** for sensitive values
   ```bru
   vars:secret [
     appSecret
   ]
   ```
2. **Rotate credentials** if accidentally exposed
3. **IP whitelist** in WeChat backend (if available)
4. **Separate test/production** accounts

### 🚨 If Credentials Are Leaked
1. **Immediately rotate** AppSecret in WeChat backend:
   - https://mp.weixin.qq.com → 设置与开发 → 基本配置 → 重置
2. **Update** `production.bru` with new AppSecret
3. **Remove** from Git history if committed:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch bruno-api/environments/production.bru" \
     --prune-empty --tag-name-filter cat -- --all
   ```

## 📖 Common Workflows

### Workflow 1: Send Template Message to User
```
1. get-all-templates.bru → Get template_id
2. get-user-list.bru → Get user openid
3. send-template-message.bru → Send message
   - Set touser, template_id, data fields
```

### Workflow 2: Tag and Organize Users
```
1. create-tag.bru → Create "VIP" tag
2. get-user-list.bru → Get user openids
3. batch-tagging.bru → Assign "VIP" tag to users
4. get-tags.bru → Verify tag count
```

### Workflow 3: Generate Tracking QR Code
```
1. generate-qrcode.bru → Create QR with scene parameter
2. Response includes ticket
3. Get image: https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=TICKET
4. User scans → Receive subscribe/SCAN event with scene
```

### Workflow 4: Upload and Use Media
```
1. upload-temp-media.bru → Upload image
2. Response includes media_id
3. Use media_id in passive reply message (within 3 days)
```

## 🐛 Troubleshooting

### Issue: "invalid appid"
**Solution:**
- Verify `appId` matches your WeChat Official Account
- Check environment is selected in Bruno
- Ensure no extra spaces in credential

### Issue: "invalid appsecret"
**Solution:**
- Confirm `appSecret` is set in `vars:secret`
- Try resetting AppSecret in WeChat backend
- Check for copy-paste errors

### Issue: Access token missing
**Solution:**
- Ensure pre-request script is enabled
- Check baseUrl is correct: `https://wxpublic.10k.xyz`
- Verify appId and appSecret are loaded
- Run `1-auth/get-access-token.bru` to test credentials

### Issue: "errcode: 40001"
**Solution:**
- Access token invalid or expired
- Pre-request script should auto-refresh
- Verify credentials are correct

### Issue: Variables showing as {{variable}}
**Solution:**
- Select environment in Bruno dropdown
- Check variable names match exactly (case-sensitive)
- Verify environment file syntax is correct

### Issue: Rate limiting
**Solution:**
- Token API: Max 1 request/second
- Template messages: 100K/day base limit
- Wait a few seconds between rapid requests
- Check WeChat backend for quota

## 📚 Additional Resources

### Official Documentation
- **WeChat Official Account Overview**: https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html
- **API Reference**: https://developers.weixin.qq.com/doc/offiaccount/Basic_Information/Access_Overview.html
- **Message Management**: https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Receiving_standard_messages.html

### Related Projects
- **n8n Community Node**: This project's n8n integration
- **Project Repository**: `/n8n-nodes-wechat-offiaccount`
- **Credentials**: `credentials/WechatOfficialAccountCredentialsApi.credentials.ts`

### Bruno Resources
- **Bruno Website**: https://www.usebruno.com/
- **Bruno Documentation**: https://docs.usebruno.com/
- **Bruno GitHub**: https://github.com/usebruno/bruno

## 🤝 Team Collaboration

### Sharing This Collection

**Via Git:**
```bash
# Clone repository
git clone <repo-url>
cd n8n-nodes-wechat-offiaccount

# Set up production environment
cp bruno-api/environments/production.example.bru bruno-api/environments/production.bru

# Edit production.bru with your credentials
# Never commit production.bru (already in .gitignore)
```

**Via Export:**
1. Open Bruno
2. Right-click collection → Export
3. Share exported file (excludes environments)

### Git Workflow
1. **Commit** request file changes (`.bru`)
2. **Never commit** `production.bru`
3. **Update** `production.example.bru` when adding new variables
4. **Document** changes in request's `docs` block

## 📝 Notes

### API Proxy
This collection uses `https://wxpublic.10k.xyz` as the base URL (instead of official `https://api.weixin.qq.com`).

**To use official API:**
1. Change `baseUrl` in environment files
2. Ensure no firewall blocking
3. Some features may require IP whitelist in WeChat backend

### Message Encryption
Enable AES-256-CBC encryption in WeChat backend if needed:
- **设置与开发 → 服务器配置 → 消息加密方式**
- Use `10-sign/` module for encryption/decryption utilities

### Response Time Limits
- Webhook replies: **5-second timeout** (3 retries)
- Plan async operations carefully
- Return empty string within 5s to prevent retries

### UnionID Availability
The `unionid` field in user info is only available when:
1. User followed the Official Account
2. User authorized with WeChat account
3. Official Account bound to WeChat Open Platform
4. User hasn't unsubscribed

## 📊 Collection Stats

- **Total Modules**: 11
- **Working Requests**: 20+
- **Environments**: 2 (test, production)
- **Auto Token Management**: ✅ Enabled
- **Documentation**: ✅ Complete
- **Tests**: ✅ Included
- **Security**: ✅ Credentials protected

## 🎯 Next Steps

1. ✅ **Set up environment** - Follow Quick Start
2. ✅ **Test credentials** - Run `1-auth/get-access-token.bru`
3. ✅ **Explore APIs** - Try user management endpoints
4. ✅ **Build workflow** - Combine multiple requests
5. ✅ **Integrate with n8n** - Use the parent project's nodes

## 📮 Support

For issues with:
- **This collection**: Check troubleshooting section above
- **n8n integration**: See project's main README
- **WeChat API**: Consult official documentation
- **Bruno**: Visit https://github.com/usebruno/bruno/issues

---

**Generated with ❤️ for the n8n-nodes-wechat-offiaccount project**

Last Updated: 2025-10-20
