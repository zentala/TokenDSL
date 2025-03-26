# CONCEPT.md – TokenDSL: Token-Efficient Backend DSL for AI-Integrated Development

## 🎯 Goal
Create a **minimal DSL (Domain Specific Language)** to describe backend APIs in a declarative, type-safe and agent-friendly way. Designed for rapid development with full TypeScript support, automatic frontend type sharing, and minimal token usage for optimal LLM performance.

## 🧱 Stack
- **Language**: TypeScript
- **Validation**: [Zod](https://zod.dev)
- **API Definition**: Custom DSL via `defineApi()`
- **Routing**: Express (or tRPC/Fastify)
- **ORM (optional)**: Prisma
- **Type Sharing**: `zod-to-ts` or `tsup` to emit shared types
- **UI Schema Support**: Declarative config for frontend UI libraries like MUI

## 🤖 Why TokenDSL?
- ✍️ Write less boilerplate
- ✅ Auto-validate and infer types
- 🔄 Share types between backend and frontend
- 🤝 Easy to use with LLMs/agents (XML/JSON friendly structure)
- 🔄 Minimize token usage by avoiding verbose abstractions
- 🧠 One source of truth per endpoint
- 🧩 Supports metadata for UI, commit messages, and LLM inference
- 🎨 Declarative MUI-style UI hints to reduce frontend code complexity

---

## 📦 DSL Example

```ts
// api/users.dsl.ts
import { z } from 'zod';
import { createUser, getUserById } from '../handlers/users';

const UserInputSchema = z.object({
  name: z.string().describe('Full name of the user'),
  email: z.string().email().describe('Email used for login'),
});

export const userApi = defineApi({
  'GET /users/:id': {
    input: z.object({ id: z.string().describe('User ID') }),
    handler: getUserById,
    description: 'Fetch a user by ID',
    tags: ['users', 'read'],
    exampleOutput: { id: '123', name: 'Alice', email: 'alice@example.com' },
    commitHint: 'Add user fetch endpoint',
    uiSchema: {
      layout: 'card',
      fields: {
        id: { type: 'text', label: 'User ID', display: 'readonly' },
      },
    },
  },
  'POST /users': {
    input: UserInputSchema,
    handler: createUser,
    description: 'Create a new user',
    tags: ['users', 'create'],
    exampleInput: { name: 'Alice', email: 'alice@example.com' },
    commitHint: 'Add user creation endpoint',
    uiSchema: {
      layout: 'form',
      fields: {
        name: { type: 'text', label: 'Full name' },
        email: { type: 'email', label: 'Email address' },
      },
    },
  },
});
```

---

## ⚙️ Runtime Engine (`dsl-engine.ts`)

```ts
export function applyApi(app, api) {
  for (const [route, def] of Object.entries(api)) {
    const [method, path] = route.split(' ');
    const handler = typeof def === 'function' ? def : def.handler;
    const inputSchema = def.input ?? null;

    app[method.toLowerCase()](path, async (req, res) => {
      try {
        const data = inputSchema ? inputSchema.parse(req.body) : {};
        const result = await handler(data, req);
        res.json(result);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
    });
  }
}
```

---

## 🤝 Type Sharing to Frontend

### Option 1: Direct re-use (monorepo)
- Put `schemas/` in a shared package
- Import Zod schemas in both FE/BE

### Option 2: Compile with `zod-to-ts`
- Use `zod-to-ts` to export types:

```ts
import { UserInputSchema } from '../schemas/user';
import { zodToTs } from 'zod-to-ts';

const { node } = zodToTs(UserInputSchema);
```

---

## 🧪 Developer Experience

### 1. Define a schema
```ts
const LoginSchema = z.object({
  email: z.string().describe('User email'),
  password: z.string().describe('User password'),
});
```

### 2. Write a handler
```ts
async function login({ email, password }) {
  return await authService.login(email, password);
}
```

### 3. Add to DSL
```ts
export const authApi = defineApi({
  'POST /login': {
    input: LoginSchema,
    handler: login,
    description: 'User login endpoint',
    tags: ['auth', 'login'],
    commitHint: 'Add login endpoint',
    uiSchema: {
      layout: 'form',
      fields: {
        email: { type: 'email', label: 'Email' },
        password: { type: 'password', label: 'Password' },
      },
    },
  },
});
```

You're done. One file = route + schema + logic + metadata + UI hints.

---

## 📊 Benefits for Architecture

| Feature                  | Benefit                                 |
|--------------------------|------------------------------------------|
| DSL-based routing        | Cleaner, declarative code                |
| Zod validation           | Safer input handling                     |
| Shared types             | No drift between FE/BE                   |
| UI schema support        | Frontend code generation via config      |
| LLM-friendly structure   | Easier codegen/agent extension           |
| Metadata support         | Enables UI gen, commit hints, auto-docs  |
| Token-efficient          | Less verbosity, lower token cost         |
| Plug-and-play engine     | Works with Express/tRPC/Fastify          |

---

## 🛠️ Future Ideas
- Auto-generate OpenAPI docs
- CLI to scaffold routes and schemas
- Frontend form generation from schemas
- Integration with authentication middleware
- VS Code plugin for autocompletion, preview, and schema editing
- Standard metadata fields for LLMs (`llmHint`, `commitHint`, `formHints`)
- Declarative frontend theming/layouts via shared config

---

## 🔚 Summary
**TokenDSL** is a clean, scalable, and type-safe backend DSL designed for AI-native development environments. With minimal token usage, maximum clarity, rich metadata, and one-source-of-truth endpoint definitions, it is perfect for modern SaaS products, LLM integrations, and developer productivity. TokenDSL now supports optional `uiSchema` fields to describe layout, labels, types and constraints — enabling automatic frontend rendering using frameworks like MUI or Tailwind.

