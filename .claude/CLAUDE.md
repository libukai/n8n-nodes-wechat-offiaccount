# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package for WeChat Official Account (微信公众号) integration. It provides nodes for interacting with the WeChat Official Account API, including message handling, user management, media operations, and more.

**Package Manager:** pnpm (version 9.1.4+)
**Node Version:** 18.10+

## Build and Development Commands

```bash
# Build the project (compile TypeScript + copy icons)
pnpm build

# Development mode with TypeScript watch
pnpm dev

# Format code
pnpm format

# Lint code
pnpm lint

# Lint and auto-fix
pnpm lintfix

# Prepare for publish (build + strict lint)
pnpm prepublishOnly
```

## Architecture Overview

### Dynamic Resource-Operation Pattern

The project uses a **dynamic module loading architecture** that automatically discovers and registers resources and operations:

1. **ResourceBuilder** (`nodes/help/builder/ResourceBuilder.ts`): Central builder that constructs n8n node properties from modular resources
2. **ModuleLoadUtils** (`nodes/help/utils/ModuleLoadUtils.ts`): Dynamically loads resource modules using glob patterns
3. **Resource Structure**: Each resource (e.g., `user`, `media`, `draft`) lives in `nodes/WechatOfficialAccountNode/resource/` and contains:
   - A resource definition file (e.g., `UserResource.ts`)
   - A subdirectory with operation files (e.g., `user/UserGetOperate.ts`)

**Key Pattern:**
```typescript
// In WechatOfficialAccountNode.node.ts
ModuleLoadUtils.loadModules(__dirname, 'resource/*.js').forEach((resource) => {
    resourceBuilder.addResource(resource);
    ModuleLoadUtils.loadModules(__dirname, `resource/${resource.value}/*.js`).forEach((operate) => {
        resourceBuilder.addOperate(resource.value, operate);
    })
});
```

### Node Types

The package provides three main node types:

1. **WechatOfficialAccountNode** (`nodes/WechatOfficialAccountNode/`): Main action node for API operations
2. **WechatOfficialAccountTrigger** (`nodes/WechatOfficialAccountTrigger/`): Webhook trigger node for receiving WeChat events
3. **WechatOfficialAccountResponseNode** (`nodes/WechatOfficialAccountResponseNode/`): Response node for replying to WeChat messages

### Resource Categories

Resources are organized by function (located in `nodes/WechatOfficialAccountNode/resource/`):

- **auth**: Access token management
- **user**: User info, blacklist, remarks
- **userTag**: User tagging and tag management
- **media**: Temporary/permanent media upload/download
- **draft**: Draft article management
- **publish**: Article publishing workflow
- **comment**: Comment management
- **template**: Template message sending
- **menu**: Custom menu configuration
- **sign**: Message encryption/decryption (AES)
- **other**: QR code generation, URL shortening

### Credential System

**File:** `credentials/WechatOfficialAccountCredentialsApi.credentials.ts`

The credential system implements:
- **preAuthentication**: Automatically fetches access_token before API calls
- **Token caching**: Uses n8n's built-in credential expiration mechanism
- **Auto-refresh**: Detects token expiration (errcode 42001) and refreshes automatically

### Message Encryption

**Utility:** `nodes/help/utils/WechatMsgSignUtils.ts`

Handles WeChat's signature verification and AES message encryption/decryption:
- **checkSignature()**: Validates webhook signatures using SHA1
- **decrypt()**: Decrypts AES-encrypted messages from WeChat
- **encrypt()**: Encrypts response messages for secure mode
- **PKCS7 padding**: Custom PKCS#7 padding implementation for AES-256-CBC

## Adding New Operations

To add a new operation:

1. **Create operation file** in the appropriate resource subdirectory:
   ```
   nodes/WechatOfficialAccountNode/resource/{resource}/{OperationName}Operate.ts
   ```

2. **Implement the operation structure**:
   ```typescript
   import { ResourceOperations } from '../../../help/type/IResource';

   export default {
       name: '操作显示名称',
       value: 'resource:operation',
       options: [
           // n8n node property definitions
       ],
       async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
           // Implementation
       },
   } as ResourceOperations;
   ```

3. **The operation will be automatically discovered** during build via ModuleLoadUtils

## Build Process

The build compiles TypeScript to `dist/` and copies icon assets:

1. `tsc` compiles TypeScript files
2. `gulp build:icons` copies PNG/SVG icons from `nodes/` and `credentials/` to `dist/`

**Output structure:**
```
dist/
├── credentials/
│   └── WechatOfficialAccountCredentialsApi.credentials.js
└── nodes/
    └── WechatOfficialAccountNode/
        └── WechatOfficialAccountNode.node.js
```

## Important Notes

- **usableAsTool**: This node is marked as usable as an AI tool (`usableAsTool: true`)
- **Error Handling**: Supports n8n's `continueOnFail` mode
- **Strict TypeScript**: Project uses strict mode with comprehensive type checking
- **n8n Version**: Targets n8n API version 1

## WeChat API Integration

The package integrates with WeChat Official Account Platform APIs:
- Base URL: `api.weixin.qq.com`
- Authentication: Access token via query parameter
- Supports both plaintext and encrypted message modes (AES-256-CBC)
