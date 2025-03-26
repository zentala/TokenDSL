# TokenDSL

Token Domain-Specific Layer for Efficient API Engineering.

## 🎯 Overview
TokenDSL is a comprehensive system for defining, validating, and deploying APIs in a token-efficient and AI-friendly way. The project integrates multiple advanced concepts:

- **Layered Architecture** - from DSL definitions to generated services
- **API Versioning** - support for multiple versions of the same API
- **Internationalization (i18n)** - multilingual support for messages
- **Test Data** - built-in demo data for each model
- **Validation** - automatic DSL file validation
- **Multi-platform Support** - Express, Fastify, Koa
- **UI Generation** - automatic UI schema creation

## 🎯 Motivation
TokenDSL was born from the need for rapid and token-efficient application development using LLMs. As developers, we noticed that most of the complex work in modern applications is repetitive boilerplate code rather than critical business logic. Token efficiency isn't just about the amount of application code - it's about the total tokens used for:
- Application setup
- Configuration
- Testing
- Package dependencies
- Infrastructure setup

Our DSL allows us to focus only on what's essential for the project while letting automation handle the rest. This is particularly important when working with LLMs, as it reduces the token overhead of:
- Setting up project structure
- Configuring dependencies
- Writing boilerplate code
- Setting up testing environments
- Managing infrastructure

## 🏗️ Architecture

### DSL Templates
TokenDSL is built around the concept of DSL Templates - predefined, versioned templates that define how DSL code should be interpreted and transformed into working applications. Each template has its own interpreter and specific set of libraries it uses.

Currently, we support two main templates (v1):

#### 1. Backend Template (Node.js)
```typescript
// backend.dsl.ts
export const backendService = defineBackend({
  name: 'my-api',
  version: '1.0',
  template: 'node-v1',
  models: {
    Product: {
      fields: {
        name: 'string',
        price: 'number',
        category: 'enum(electronics,clothing)'
      }
    }
  },
  endpoints: {
    'GET /products': {
      description: 'List all products',
      auth: 'required',
      response: 'Product[]'
    }
  }
});
```

#### 2. Frontend Template (React)
```typescript
// frontend.dsl.ts
export const frontendApp = defineFrontend({
  name: 'my-shop',
  version: '1.0',
  template: 'react-v1',
  pages: {
    products: {
      layout: 'grid',
      components: {
        productList: {
          type: 'ProductList',
          data: 'products'
        }
      }
    }
  }
});
```

### Template System
Each template is a complete, self-contained system that includes:
- DSL syntax definition
- Interpreter implementation
- Required dependencies
- Build and deployment configuration
- Testing setup

This architecture allows us to:
- Add new templates for different platforms
- Version templates independently
- Keep business logic separate from implementation details
- Automate the entire development process

### Serverless CMS Approach
TokenDSL follows a "serverless CMS" approach where:
- Business logic is defined in DSL
- Implementation details are handled by templates
- No server configuration is needed
- Everything is generated from DSL definitions

## 🤔 What is DSL?
A Domain-Specific Language (DSL) is a programming language specialized to a particular application domain. In our case, TokenDSL is designed specifically for creating web applications and APIs with minimal code.

### Why DSL?
DSLs help us write programs faster by:
- Reducing boilerplate code
- Providing domain-specific abstractions
- Making the code more readable and maintainable
- Enabling rapid prototyping and development

### How TokenDSL Works
TokenDSL uses `.dsl.ts` files that are interpreted by our DSL interpreter. This interpreter understands our custom syntax and automatically generates:
- Complete web applications
- API endpoints
- Database schemas
- UI components
- Documentation

For example, instead of writing multiple files for a user management system:
```typescript
// users.dsl.ts
export const userService = defineService({
  name: 'users',
  version: '1.0',
  models: {
    User: {
      fields: {
        name: 'string',
        email: 'string',
        role: 'enum(user,admin)'
      }
    }
  },
  endpoints: {
    'GET /users': {
      description: 'List all users',
      auth: 'required',
      response: 'User[]'
    }
  }
});
```

The interpreter will generate all necessary files and configurations, making development much faster and more efficient.

## 🚧 Status
Project in early development stage.

## 📚 Documentation
Full project documentation is available in the `.cursor/` directory:

- [VISION.md](.cursor/VISION.md) - Comprehensive project vision
- [TECHNICAL.md](.cursor/TECHNICAL.md) - Technical specification
- [FEAT.md](.cursor/FEAT.md) - Features and roadmap
- [TODO.md](.cursor/TODO.md) - Task list
- [PRODUCT.md](.cursor/PRODUCT.md) - Product specification

### Diagrams
Architecture and data flow visualizations:
- [VISION.flowchart.xml](.cursor/VISION.flowchart.xml) - Flow diagram (SVG)
- [VISION.flow.mairmaid](.cursor/VISION.flow.mairmaid) - Flow diagram (Mermaid)
- [VISION.diagram.mairmaid](.cursor/VISION.diagram.mairmaid) - Class diagram (Mermaid)
- [VISION.arch.mairmaid](.cursor/VISION.arch.mairmaid) - Architecture diagram (Mermaid)

## 🛠️ Development
To get started with the project:

1. Clone the repository
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`

## 📝 License
MIT
