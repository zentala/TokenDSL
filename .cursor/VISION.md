# TokenDSL: Token-Efficient Backend DSL for AI-Integrated Development

## 🎯 Project Overview

TokenDSL is a comprehensive system for defining, validating, and deploying APIs in a token-efficient way that is friendly to AI models. The project integrates several advanced concepts:

- ✍️ Minimizing boilerplate code
- ✅ Automatic validation and type inference
- 🔄 Sharing types between backend and frontend
- 🤝 LLM/agent friendliness (XML/JSON structure)
- 🔄 Token usage minimization
- 🧠 One source file per endpoint
- 🧩 Support for UI metadata, commits, and LLM inference
- 🎨 Declarative UI hints in MUI style

## 🏗️ Architecture

### 1. System Layers
- **DSL Definition Layer** (.dsl.ts files)
- **Processing Layer** (loader, validator, generator)
- **API Deployment Layer** (generated servers)
- **Client Layer** (frontend, documentation)

### 2. Project Structure

```
project-root/
├── dsl/                                # Main directory for DSL definitions
│   ├── users-service-v1.0/             # Users service in version 1.0
│   │   ├── index.dsl.ts                # Main service definition file
│   │   ├── models/                     # Data models
│   │   │   ├── user.model.dsl.ts       # User model
│   │   │   └── role.model.dsl.ts       # Role model
│   │   ├── endpoints/                  # Endpoints
│   │   │   ├── users.endpoints.dsl.ts  # User endpoints
│   │   │   └── auth.endpoints.dsl.ts   # Authentication endpoints
│   │   ├── i18n/                       # Translations
│   │   │   ├── en.mo                   # English translations
│   │   │   ├── pl.mo                   # Polish translations
│   │   │   └── i18n.dsl.ts             # i18n configuration
│   │   ├── test-data/                  # Example test data
│   │   │   ├── users.data.json         # User data
│   │   │   └── roles.data.json         # Role data
│   │   └── service.config.dsl.ts       # Service configuration
│   ├── orders-service-v2.0/            # Orders service in version 2.0
│   │   ├── index.dsl.ts
│   │   ├── models/
│   │   ├── endpoints/
│   │   ├── i18n/
│   │   ├── test-data/
│   │   └── service.config.dsl.ts
│   └── common/                         # Shared resources
│       ├── models/                     # Shared models
│       ├── middlewares/                # Shared middleware
│       └── validators/                 # Shared validators
├── src/                                # Source code
│   ├── server.ts                       # Main server
│   ├── dsl-loader.ts                   # Loader for DSL files
│   ├── dsl-validator.ts                # DSL validator
│   └── services-manager.ts             # Service management
├── config/                             # Project configuration
│   ├── server.config.ts                # Server configuration
│   └── services.config.ts              # Services configuration
└── dist/                               # Compiled files
```

### 3. Technology Stack
- **Language**: TypeScript
- **Validation**: [Zod](https://zod.dev)
- **API Definition**: Custom DSL via `defineApi()`
- **Routing**: Express/Fastify/Koa
- **ORM (optional)**: Prisma
- **Type Sharing**: `zod-to-ts` or `tsup`
- **UI Schema Support**: Declarative configuration for frontend libraries

## 📦 DSL Examples

### Basic DSL Example

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

### Advanced Service Definition

```typescript
// dsl/users-service-v1.0/index.dsl.ts
import { defineService } from '@tokendsl/core';
import * as userEndpoints from './endpoints/users.endpoints.dsl';
import * as authEndpoints from './endpoints/auth.endpoints.dsl';
import { serviceConfig } from './service.config.dsl';

export default defineService({
  name: 'users-service',
  version: '1.0',
  config: serviceConfig,
  endpoints: {
    ...userEndpoints,
    ...authEndpoints
  }
});
```

### Service Configuration

```typescript
// dsl/users-service-v1.0/service.config.dsl.ts
import { defineServiceConfig } from '@tokendsl/core';

export const serviceConfig = defineServiceConfig({
  port: 3001,
  basePath: '/api/v1',
  cors: {
    enabled: true,
    origins: ['http://localhost:3000']
  },
  docs: {
    enabled: true,
    path: '/docs'
  },
  i18n: {
    defaultLocale: 'en',
    supportedLocales: ['en', 'pl']
  },
  testData: {
    enabled: process.env.NODE_ENV !== 'production',
    path: './test-data'
  }
});
```

### Model Definition

```typescript
// dsl/users-service-v1.0/models/user.model.dsl.ts
import { defineModel, z } from '@tokendsl/core';

export const UserModel = defineModel({
  name: 'User',
  schema: z.object({
    id: z.string().uuid().describe('User ID'),
    username: z.string().min(3).max(50).describe('Username'),
    email: z.string().email().describe('Email address'),
    password: z.string().min(8).describe('Password (hashed)'),
    role: z.enum(['user', 'admin']).describe('User role'),
    createdAt: z.date().describe('Creation date'),
    updatedAt: z.date().describe('Last update date')
  }),
  relations: {
    hasMany: {
      orders: 'Order'
    }
  },
  indexes: [
    { fields: ['email'], unique: true }
  ],
  i18n: {
    fields: {
      username: { key: 'user.username' },
      email: { key: 'user.email' }
    }
  },
  testData: './test-data/users.data.json',
  validation: {
    custom: [
      {
        name: 'uniqueEmail',
        message: 'Email must be unique',
        validate: async (value, ctx) => {
          // Email uniqueness validation
          return true;
        }
      }
    ]
  }
});
```

### Endpoint Definition

```typescript
// dsl/users-service-v1.0/endpoints/users.endpoints.dsl.ts
import { defineEndpoints, z } from '@tokendsl/core';
import { UserModel } from '../models/user.model.dsl';

export default defineEndpoints({
  'GET /users': {
    description: 'Get all users',
    tags: ['users'],
    version: '1.0',
    auth: { required: true, roles: ['admin'] },
    input: z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10)
    }),
    output: z.object({
      users: z.array(UserModel.schema),
      total: z.number(),
      page: z.number(),
      pages: z.number()
    }),
    handler: 'handlers/users/getUsers',
    i18n: {
      messages: {
        success: 'users.list.success',
        error: 'users.list.error'
      }
    },
    docs: {
      examples: {
        success: { ref: 'examples/users/list-success.json' },
        error: { ref: 'examples/users/list-error.json' }
      }
    }
  },
  
  'GET /users/:id': {
    description: 'Get user by ID',
    version: '1.0',
    tags: ['users'],
    auth: { required: true },
    input: z.object({
      id: z.string().uuid()
    }),
    output: UserModel.schema,
    handler: 'handlers/users/getUserById',
    caching: {
      enabled: true,
      ttl: 60 // 60 seconds
    }
  },

  'POST /users': {
    description: 'Create a new user',
    version: '1.0',
    tags: ['users'],
    auth: { required: true, roles: ['admin'] },
    input: UserModel.schema.omit({ id: true, createdAt: true, updatedAt: true }),
    output: UserModel.schema,
    handler: 'handlers/users/createUser',
    validation: {
      custom: ['uniqueEmail']
    },
    uiSchema: {
      layout: 'form',
      fields: {
        username: { type: 'text', label: 'i18n:user.username' },
        email: { type: 'email', label: 'i18n:user.email' },
        password: { type: 'password', label: 'i18n:user.password' },
        role: { type: 'select', label: 'i18n:user.role', options: [
          { value: 'user', label: 'i18n:user.role.user' },
          { value: 'admin', label: 'i18n:user.role.admin' }
        ]}
      }
    }
  }
});
```

## ⚙️ Runtime Engine

```ts
// dsl-engine.ts
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

## 🌟 Key Features

### 1. API Versioning

- Directory structure based on service names and versions
- Support for multiple versions of the same API running in parallel
- Automatic version management in routing

### 2. Internationalization (i18n)

- Translation files in .mo format for each service
- Support for multiple languages in messages and documentation
- Automatic translation management in DSL

### 3. Test Data

- Built-in demonstration data for each model
- Possibility of automatically populating the development environment
- Generating sample data based on schemas

### 4. Validation

- Automatic validation of DSL files
- Type checking
- Verification of dependencies between services
- UI schema validation

### 5. Platform Support

- Express
- Fastify
- Koa
- Ability to add new platforms

### 6. UI Generation

- Automatic creation of UI schemas
- Support for various component libraries
- Customization of appearance through themes

## 🎨 Frontend Support

### 1. Components

- Basic UI components (Button, Input, Card)
- Form components (Form, Select, Checkbox)
- Layout components (Grid, Stack, Modal)
- Data components (Table, Chart, Calendar)

### 2. Themes

- Light - default light theme
- Dark - dark theme
- Custom - ability to create custom themes

### 3. Frontend DSL

```typescript
export const userForm = defineComponent({
  type: 'form',
  fields: [
    { name: 'username', type: 'string', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'role', type: 'enum', options: ['user', 'admin'] }
  ],
  actions: [
    { type: 'submit', label: 'Save' },
    { type: 'cancel', label: 'Cancel' }
  ]
});
```

## 🔄 Backend Integration

### 1. Type Sharing

- Direct schema usage (monorepo)
- Compilation with `zod-to-ts`
- Automatic type synchronization

### 2. API Endpoints

- GET /api/components
- GET /api/examples
- POST /api/validate
- GET /api/themes
- POST /api/preview

### 3. Data

- Retrieval from TokenDSL backend
- Automatic schema synchronization
- API versioning support

## 🛠️ Developer Tools

### 1. CLI

```bash
# Initialize a new project
npx tokendsl init my-api

# Generate code from DSL definition
npx tokendsl generate definitions/users-api.xml

# Create a new endpoint
npx tokendsl create users/create --method POST

# Generate documentation
npx tokendsl docs generate

# Generate frontend code
npx tokendsl frontend generate --framework react
```

### 2. VS Code Plugin

- DSL syntax highlighting
- Auto-completion
- Component preview
- Live validation

### 3. Debugging

- React DevTools
- Network panel
- Console
- Sources

## 🧪 Testing

### 1. Unit Tests

- Components
- Helper functions
- Validators

### 2. Integration Tests

- API
- DSL
- Themes

### 3. E2E Tests

- Use cases
- User flows
- Responsiveness

## 📈 Development Plan

### 1. Phase 1: Foundations

- Implementation of basic DSL
- Type generation
- Schema validation

### 2. Phase 2: Frontend

- UI component generation
- Theme system
- Backend integration

### 3. Phase 3: Tools

- CLI
- VS## 📈 Development Plan (Continued)

### 3. Phase 3: Tools

- CLI
- VS Code plugin
- Documentation

### 4. Phase 4: Extensions

- Support for new platforms
- Additional components
- Performance optimizations

## 🤝 Conclusions and Recommendations

### 1. Priorities

- Focus on token efficiency
- Maintain DSL simplicity
- Good TypeScript support

### 2. Challenges

- Balance between flexibility and simplicity
- Performance optimization
- Version management

### 3. Next Steps

1. Implementation of basic DSL
2. Creation of type generator
3. Development of developer tools
4. Building component ecosystem

## 🔧 Implementation Details

### DSL Validation System

The DSL validation system uses Zod schemas to validate various components of the TokenDSL ecosystem:

```typescript
// Example of model schema validation
const ModelSchema = z.object({
  name: z.string(),
  schema: z.any(), // Zod schema
  relations: z.optional(z.object({
    hasMany: z.optional(z.record(z.string())),
    belongsTo: z.optional(z.record(z.string())),
    hasOne: z.optional(z.record(z.string()))
  })),
  indexes: z.optional(z.array(z.object({
    fields: z.array(z.string()),
    unique: z.optional(z.boolean())
  }))),
  i18n: z.optional(z.object({
    fields: z.record(z.object({
      key: z.string()
    }))
  })),
  testData: z.optional(z.string()),
  validation: z.optional(z.object({
    custom: z.optional(z.array(z.object({
      name: z.string(),
      message: z.string(),
      validate: z.function()
    })))
  }))
});
```

### DSL Loader

The DSL Loader is responsible for loading service definitions from DSL files:

```typescript
export class DslLoader {
  private servicesDir: string;
  private services: Map<string, ServiceDefinition> = new Map();

  constructor(servicesDir: string) {
    this.servicesDir = servicesDir;
  }

  /**
   * Loads all DSL services from directory
   */
  async loadAllServices(): Promise<Map<string, ServiceDefinition>> {
    // Find all index.dsl.ts files
    const serviceFiles = await glob(`${this.servicesDir}/**/index.dsl.ts`);
    
    // Validate first
    const validationErrors = await validateDslFiles(this.servicesDir);
    if (validationErrors.length > 0) {
      console.error('DSL validation errors:');
      validationErrors.forEach(err => {
        console.error(`${err.file}: ${err.error}`);
      });
      throw new Error('DSL validation failed');
    }
    
    // Load each service
    for (const file of serviceFiles) {
      try {
        const serviceDef = await import(file);
        const serviceDefault = serviceDef.default;
        
        if (!serviceDefault || !serviceDefault.name || !serviceDefault.version) {
          console.warn(`Invalid service definition in ${file}`);
          continue;
        }
        
        const serviceKey = `${serviceDefault.name}-v${serviceDefault.version}`;
        this.services.set(serviceKey, serviceDefault);
        
        console.log(`Loaded service: ${serviceKey}`);
      } catch (error) {
        console.error(`Failed to load service from ${file}:`, error);
      }
    }
    
    return this.services;
  }
  
  // Other methods: loadService, loadTestDataForService, loadTranslationsForService...
}
```

### Services Manager

The Services Manager handles the lifecycle of multiple services:

```typescript
export class ServicesManager {
  private options: ServicesManagerOptions;
  private loader: DslLoader;
  private runningServices: Map<string, {
    port: number;
    server: any;
  }> = new Map();

  constructor(options: ServicesManagerOptions) {
    this.options = options;
    this.loader = new DslLoader(options.servicesDir);
  }

  /**
   * Initializes the services manager
   */
  async initialize(): Promise<void> {
    await this.loader.loadAllServices();
    console.log(`Loaded ${this.loader.getServiceNames().length} services`);
  }

  /**
   * Starts all services
   */
  async startAllServices(): Promise<void> {
    const services = this.loader.getAllServices();
    
    for (const service of services) {
      await this.startService(service.name, service.version);
    }
  }
  
  // Other methods: startService, stopService, restartService...
}
```

## 📊 TypeScript Type Definitions

The TokenDSL type system provides strong typing for all components:

```typescript
// Main DSL types
export type ApiDefinition = Record<string, EndpointDefinition>;

export interface EndpointDefinition<T = any, R = any> {
  input?: z.ZodType<T>;
  output?: z.ZodType<R>;
  handler: Handler<T, R>;
  description?: string;
  tags?: string[];
  middleware?: Middleware[];
  statusCodes?: Record<number, string>;
  uiSchema?: UISchema;
  examples?: {
    input?: T;
    output?: R;
  };
  tests?: Test[];
  commitHint?: string;
}

export interface UISchema {
  layout: 'form' | 'card' | 'table' | 'grid';
  formOptions?: {
    submitText?: string;
    cancelText?: string;
    fullWidth?: boolean;
  };
  fields: Record<string, UIField>;
}

export interface UIField {
  type: string;
  label: string;
  display?: 'default' | 'readonly' | 'hidden';
  required?: boolean;
  helperText?: string;
  validationRules?: Record<string, any>;
}
```

## 🎨 XML Representation

TokenDSL can also be represented in XML format for better interoperability:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<tokenDSL version="1.0">
  <api name="userApi" prefix="/api/v1">
    <endpoint method="GET" path="/users/:id">
      <description>Fetch a user by ID</description>
      <tags>
        <tag>users</tag>
        <tag>read</tag>
      </tags>
      <input>
        <schema>
          <object>
            <property name="id" type="string" description="User ID" />
          </object>
        </schema>
      </input>
      <output>
        <schema>
          <object>
            <property name="id" type="string" description="User ID" />
            <property name="name" type="string" description="Full name of the user" />
            <property name="email" type="string" format="email" description="Email used for login" />
          </object>
        </schema>
      </output>
      <handler file="handlers/users.ts" function="getUserById" />
      <middleware>
        <apply>authMiddleware</apply>
        <apply>logMiddleware</apply>
      </middleware>
      <statusCodes>
        <code value="200">Success</code>
        <code value="404">User not found</code>
        <code value="500">Internal server error</code>
      </statusCodes>
      <examples>
        <example type="output">
          <value><![CDATA[{ "id": "123", "name": "Alice", "email": "alice@example.com" }]]></value>
        </example>
      </examples>
      <uiSchema>
        <layout>card</layout>
        <fields>
          <field name="id">
            <type>text</type>
            <label>User ID</label>
            <display>readonly</display>
          </field>
        </fields>
      </uiSchema>
      <docs>
        <summary>Fetch a specific user</summary>
        <description>Retrieves user details by their unique identifier</description>
      </docs>
      <commitHint>Add user fetch endpoint</commitHint>
    </endpoint>
  </api>
</tokenDSL>
```

## 📦 Project Package Structure

```
tokendsl/
├── package.json                # npm package definition
├── tsconfig.json               # TypeScript configuration
├── README.md                   # Project documentation
├── src/                        # Library source code
│   ├── index.ts                # Main entry point
│   ├── cli.ts                  # Command line interface code
│   ├── generator/              # Code generator
│   │   ├── index.ts            # Generator export
│   │   ├── xml-parser.ts       # XML definition parser
│   │   ├── typescript-gen.ts   # TypeScript code generator
│   │   ├── zod-gen.ts          # Zod schema generator
│   │   ├── express-gen.ts      # Express backend generator
│   │   ├── fastify-gen.ts      # Fastify backend generator
│   │   └── ui-gen.ts           # UI component generator
│   ├── dsl/                    # DSL engine
│   │   ├── engine.ts           # Main DSL engine
│   │   ├── types.ts            # Type definitions
│   │   ├── validators.ts       # Validators
│   │   └── utils.ts            # Helper tools
│   ├── transforms/             # Transformers for different formats
│   │   ├── openapi.ts          # OpenAPI conversion
│   │   ├── postman.ts          # Postman collection conversion
│   │   └── typescript.ts       # TypeScript type conversion
│   └── templates/              # Generated file templates
│       ├── express/            # Express templates
│       ├── fastify/            # Fastify templates
│       ├── react/              # React templates
│       └── vue/                # Vue templates
├── bin/                        # Executable scripts
│   └── tokendsl.js             # CLI executable file
├── templates/                  # Project initialization templates
│   ├── example.xml             # Example API definition
│   ├── example-handler.ts      # Example handler
│   └── project-structure/      # Project structure templates
├── examples/                   # Example projects
│   ├── basic-api/              # Basic API
│   ├── full-stack/             # Full stack with frontend
│   └── microservices/          # Microservice architecture
└── docs/                       # Documentation
    ├── guide/                  # User guide
    │   ├── getting-started.md  # Introduction
    │   ├── xml-syntax.md       # XML syntax
    │   ├── typescript-api.md   # TypeScript API
    │   └── ui-schema.md        # UI schemas
    ├── api/                    # API documentation
    │   ├── engine.md           # DSL engine documentation
    │   ├── generator.md        # Generator documentation
    │   └── cli.md              # CLI documentation
    └── examples/               # Usage examples
        ├── basic.md            # Basic examples
        ├── advanced.md         # Advanced examples
        └── real-world.md       # Real-world examples
```

## 🌟 Summary

TokenDSL is an innovative API creation system that combines:
- Token efficiency for AI models
- TypeScript type safety
- DSL declarativeness
- Automatic UI generation
- Support for multiple platforms
- Advanced features like versioning and i18n

The project is particularly useful for teams using language models to generate code, as the DSL structure is optimized for token efficiency and unambiguity. It can serve as a "microservice factory" where each version of each service can be independently developed, tested, and deployed, all based on a unified definition model.

With TokenDSL, developers can:
1. Define APIs in a compact, declarative way
2. Automatically validate input and output
3. Generate documentation, UI, and client code
4. Easily implement versioning and internationalization
5. Create consistent user interfaces with minimal effort
6. Enable better AI integration for code generation

By using TokenDSL, development teams can focus on business logic while the framework handles the repetitive aspects of API development, resulting in faster development cycles and more consistent code.


src: https://claude.ai/chat/c46b54cd-97a6-4b4f-8fc7-8cc1f2292d81