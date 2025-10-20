# Environment Configuration Guide

This directory contains environment-specific configurations for the WeChat Official Account API collection.

## Files Overview

| File | Purpose | Git Status | Use Case |
|------|---------|-----------|----------|
| `test.bru` | Test environment with dummy credentials | ✅ Committed | Development and testing |
| `production.bru` | Production environment with real credentials | ⛔ Gitignored | Real API calls |
| `production.example.bru` | Template for production setup | ✅ Committed | Reference for team setup |
| `README.md` | This documentation | ✅ Committed | Environment setup guide |

## Quick Start

### For Development (Test Environment)

1. Select **test** environment in Bruno
2. The test environment is pre-configured with dummy values
3. Update `appId`, `appSecret`, and `testOpenId` with your test account credentials

### For Production

1. **Copy the example file:**
   ```bash
   cp environments/production.example.bru environments/production.bru
   ```

2. **Edit `production.bru`** and set your real credentials:
   - `appId`: Your WeChat Official Account AppID
   - `appSecret`: Your AppSecret (this goes in vars:secret section)
   - `testOpenId`: A real user OpenID for testing

3. **Set the secret value** in Bruno:
   - Open Bruno
   - Select **production** environment
   - Click the lock icon next to `appSecret`
   - Enter your real AppSecret value

4. **Verify the setup** by running `1-auth/get-access-token.bru`

## Available Variables

### Common Variables (All Environments)

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API base URL | `https://wxpublic.10k.xyz` |
| `appId` | WeChat Official Account AppID | `wx1234567890abcdef` |
| `testOpenId` | Test user OpenID | `oABC123xyz...` |
| `accessToken` | Auto-generated access token | (set by pre-request scripts) |

### Secret Variables (Production Only)

| Variable | Description | Storage |
|----------|-------------|---------|
| `appSecret` | WeChat AppSecret | `vars:secret` (encrypted in Bruno) |

## Security Notes

### ✅ Safe to Commit
- `test.bru` - Contains only test/dummy credentials
- `production.example.bru` - Template without real credentials
- `README.md` - Documentation

### ⛔ NEVER Commit
- `production.bru` - Contains real credentials
  - Already added to `.gitignore`
  - If accidentally committed, immediately rotate your AppSecret in WeChat backend

### 🔐 Best Practices

1. **Use vars:secret** for sensitive values (appSecret, tokens)
2. **Rotate credentials** regularly
3. **Limit IP access** in WeChat backend if possible
4. **Use test environment** for development
5. **Never share** production.bru file

## Switching Environments

In Bruno:
1. Click the environment dropdown (top-right)
2. Select **test** or **production**
3. Verify the correct `baseUrl` and `appId` are loaded

## Access Token Management

The `accessToken` variable is automatically managed by pre-request scripts in most API requests:

```javascript
// Pre-request script (automatically runs)
const tokenResponse = await fetch(`${baseUrl}/cgi-bin/stable_token`, {
  method: 'POST',
  body: JSON.stringify({
    grant_type: 'client_credential',
    appid: appId,
    secret: appSecret
  })
});

const tokenData = await tokenResponse.json();
bru.setVar('accessToken', tokenData.access_token);
```

**You don't need to manually set `accessToken`** - it's fetched automatically before each request.

## Testing Your Setup

Run these requests in order to verify your environment:

1. **Get Access Token** (`1-auth/get-access-token.bru`)
   - Should return `errcode: 0` and an `access_token`
   - Token valid for 7200 seconds (2 hours)

2. **Get User Info** (`2-user/get-user-info.bru`)
   - Requires a valid `testOpenId`
   - Returns user profile including `unionid` (if user authorized)

3. **Get User List** (`2-user/get-user-list.bru`)
   - Returns list of followers
   - Works without additional parameters

## Troubleshooting

### Error: "invalid appid"
- Check that `appId` in your environment matches your WeChat Official Account
- Verify you're using the correct environment (test vs production)

### Error: "invalid appsecret"
- Ensure `appSecret` is correctly set in Bruno's secret storage
- Check for extra spaces or characters
- Verify the secret hasn't been rotated in WeChat backend

### Error: "access_token missing"
- Check that pre-request script is enabled
- Verify environment variables are loaded
- Try running `1-auth/get-access-token.bru` first

### Variables not interpolating (showing {{variable}})
- Ensure an environment is selected in Bruno
- Click the environment dropdown and verify selection
- Check that variable names match exactly (case-sensitive)

### Rate Limiting
- WeChat allows 1 token request per second
- Most APIs have per-day limits
- Wait a few seconds between rapid requests

## Where to Get Credentials

1. Log in to WeChat Official Account Platform: https://mp.weixin.qq.com
2. Navigate to: **设置与开发 → 基本配置** (Settings & Development → Basic Configuration)
3. Find:
   - **AppID** (开发者ID): Your application ID
   - **AppSecret** (开发者密码): Click "Reset" if you don't have it
4. For **testOpenId**:
   - Go to **用户管理** (User Management)
   - Find a test user's OpenID
   - Or use the "获取用户列表" API to get OpenIDs

## API Proxy Note

This collection uses `https://wxpublic.10k.xyz` as the base URL instead of the official `https://api.weixin.qq.com`.

If you need to use the official API:
1. Change `baseUrl` to `https://api.weixin.qq.com`
2. Ensure your server can reach WeChat's API (no firewall/proxy blocking)

## Links

- **WeChat Official Account Platform**: https://mp.weixin.qq.com
- **Developer Documentation**: https://developers.weixin.qq.com/doc/offiaccount/Getting_Started/Overview.html
- **Get AppID/AppSecret**: https://mp.weixin.qq.com/ → 设置与开发 → 基本配置
