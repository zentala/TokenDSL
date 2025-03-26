
jak dopisac do tego rozwiszzania cos takkiego aby:
* moc tworzyc wiele serwisoz s plikow .dlsl.ds tylko, i aby moc w nch wesrsiojwoac api, oraz aby moc w nich miec wiele 
np 

/dsl/<sevice-name>-v17.04/index.dls.ts 
/dsl/<my-other-bacejed>-v2.0/index.dls.ts 
/dsl/<my-other-bacejed>-v2.0/i8n/<xx>.mo (translations?) 

i tutaj cala struktuea pkikow, czesc to dls.ts ale tez jakie dslowe pliki tlumaczen, tez zapomnielismy dposiac do struktyr dls przuykladowe dane do kazdego modelu na ktorych bedziemy testowac i zasiewac apliakcje

do tego backend czuyl iten ktory z plikow dls bedzie stawial serwery musi miec jakis walidator tuch dlsow, jakbys ogarnal taka architketue?

Edit
Rozumiem Twoje wymagania dotyczące rozszerzenia TokenDSL o funkcje:

Wersjonowanie API
Obsługa wielu serwisów w różnych plikach .dsl.ts
Wsparcie dla tłumaczeń (i18n)
Przykładowe dane testowe dla modeli
Walidację plików DSL
Oto proponowane rozwiązanie:

# Rozszerzona struktura TokenDSL

```
project-root/
├── dsl/                                # Katalog główny dla definicji DSL
│   ├── users-service-v1.0/             # Serwis users w wersji 1.0
│   │   ├── index.dsl.ts                # Główny plik definicji serwisu
│   │   ├── models/                     # Modele danych
│   │   │   ├── user.model.dsl.ts       # Model użytkownika
│   │   │   └── role.model.dsl.ts       # Model roli
│   │   ├── endpoints/                  # Endpointy
│   │   │   ├── users.endpoints.dsl.ts  # Endpointy użytkowników
│   │   │   └── auth.endpoints.dsl.ts   # Endpointy autoryzacji
│   │   ├── i18n/                       # Tłumaczenia
│   │   │   ├── en.mo                   # Angielskie tłumaczenia
│   │   │   ├── pl.mo                   # Polskie tłumaczenia
│   │   │   └── i18n.dsl.ts             # Konfiguracja i18n
│   │   ├── test-data/                  # Przykładowe dane testowe
│   │   │   ├── users.data.json         # Dane użytkowników
│   │   │   └── roles.data.json         # Dane ról
│   │   └── service.config.dsl.ts       # Konfiguracja serwisu
│   ├── orders-service-v2.0/            # Serwis orders w wersji 2.0
│   │   ├── index.dsl.ts
│   │   ├── models/
│   │   ├── endpoints/
│   │   ├── i18n/
│   │   ├── test-data/
│   │   └── service.config.dsl.ts
│   └── common/                         # Współdzielone zasoby
│       ├── models/                     # Współdzielone modele
│       ├── middlewares/                # Współdzielone middleware
│       └── validators/                 # Współdzielone walidatory
├── src/                                # Kod źródłowy backendu
│   ├── server.ts                       # Główny serwer
│   ├── dsl-loader.ts                   # Loader dla plików DSL
│   ├── dsl-validator.ts                # Walidator DSL
│   └── services-manager.ts             # Zarządzanie wieloma serwisami
├── config/                             # Konfiguracja projektu
│   ├── server.config.ts                # Konfiguracja serwera
│   └── services.config.ts              # Konfiguracja serwisów
└── dist/                               # Skompilowane pliki
```

## Struktura plików DSL

### 1. Główny plik definicji serwisu (`index.dsl.ts`)

```typescript
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

### 2. Konfiguracja serwisu (`service.config.dsl.ts`)

```typescript
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

### 3. Definicja modelu (`user.model.dsl.ts`)

```typescript
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
          // Walidacja unikalności emaila
          return true;
        }
      }
    ]
  }
});
```

### 4. Definicja endpointów (`users.endpoints.dsl.ts`)

```typescript
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
      ttl: 60 // 60 sekund
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

### 5. Konfiguracja i18n (`i18n.dsl.ts`)

```typescript
import { defineI18n } from '@tokendsl/core';

export default defineI18n({
  defaultLocale: 'en',
  locales: {
    en: './en.mo',
    pl: './pl.mo'
  },
  namespaces: [
    'common',
    'users',
    'auth',
    'errors'
  ]
});
```

### 6. Dane testowe (`users.data.json`)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "email": "admin@example.com",
    "password": "$2b$10$...",
    "role": "admin",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "username": "user1",
    "email": "user1@example.com",
    "password": "$2b$10$...",
    "role": "user",
    "createdAt": "2023-01-02T00:00:00Z",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
]
```

## Walidator DSL

```typescript
// src/dsl-validator.ts
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import glob from 'glob-promise';

// Schemat modelu
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

// Schemat endpointu
const EndpointSchema = z.object({
  description: z.string(),
  version: z.string(),
  tags: z.array(z.string()),
  auth: z.optional(z.object({
    required: z.boolean(),
    roles: z.optional(z.array(z.string()))
  })),
  input: z.any(), // Zod schema
  output: z.any(), // Zod schema
  handler: z.string(),
  i18n: z.optional(z.object({
    messages: z.record(z.string())
  })),
  docs: z.optional(z.object({
    examples: z.record(z.object({
      ref: z.string()
    }))
  })),
  caching: z.optional(z.object({
    enabled: z.boolean(),
    ttl: z.number()
  })),
  validation: z.optional(z.object({
    custom: z.array(z.string())
  })),
  uiSchema: z.optional(z.object({
    layout: z.string(),
    fields: z.record(z.object({
      type: z.string(),
      label: z.string(),
      options: z.optional(z.array(z.object({
        value: z.any(),
        label: z.string()
      })))
    }))
  }))
});

// Schemat serwisu
const ServiceSchema = z.object({
  name: z.string(),
  version: z.string(),
  config: z.any(), // ServiceConfig
  endpoints: z.record(z.any())
});

// Schemat konfiguracji serwisu
const ServiceConfigSchema = z.object({
  port: z.number(),
  basePath: z.string(),
  cors: z.object({
    enabled: z.boolean(),
    origins: z.array(z.string())
  }),
  docs: z.object({
    enabled: z.boolean(),
    path: z.string()
  }),
  i18n: z.object({
    defaultLocale: z.string(),
    supportedLocales: z.array(z.string())
  }),
  testData: z.object({
    enabled: z.boolean(),
    path: z.string()
  })
});

export async function validateDslFiles(rootDir: string) {
  const errors: Array<{ file: string, error: string }> = [];
  
  // Znajdź wszystkie pliki DSL
  const files = await glob(`${rootDir}/**/*.dsl.ts`);
  
  for (const file of files) {
    try {
      // Importuj plik DSL
      const dslModule = await import(file);
      const dslDefault = dslModule.default;
      
      // Sprawdź typ DSL i zwaliduj
      if (file.includes('model')) {
        ModelSchema.parse(dslDefault || dslModule);
      } else if (file.includes('endpoints')) {
        // Walidacja każdego endpointu
        const endpoints = dslDefault || dslModule;
        for (const [path, endpoint] of Object.entries(endpoints)) {
          EndpointSchema.parse(endpoint);
        }
      } else if (file.includes('index.dsl.ts')) {
        ServiceSchema.parse(dslDefault);
      } else if (file.includes('service.config.dsl.ts')) {
        ServiceConfigSchema.parse(dslDefault || dslModule.serviceConfig);
      }
    } catch (error) {
      errors.push({
        file,
        error: error.message


// src/dsl-loader.ts
import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob-promise';
import { validateDslFiles } from './dsl-validator';

export interface ServiceDefinition {
  name: string;
  version: string;
  config: any;
  endpoints: Record<string, any>;
}

export class DslLoader {
  private servicesDir: string;
  private services: Map<string, ServiceDefinition> = new Map();

  constructor(servicesDir: string) {
    this.servicesDir = servicesDir;
  }

  /**
   * Ładuje wszystkie serwisy DSL z katalogu
   */
  async loadAllServices(): Promise<Map<string, ServiceDefinition>> {
    // Znajdź wszystkie pliki index.dsl.ts
    const serviceFiles = await glob(`${this.servicesDir}/**/index.dsl.ts`);
    
    // Najpierw walidacja
    const validationErrors = await validateDslFiles(this.servicesDir);
    if (validationErrors.length > 0) {
      console.error('DSL validation errors:');
      validationErrors.forEach(err => {
        console.error(`${err.file}: ${err.error}`);
      });
      throw new Error('DSL validation failed');
    }
    
    // Załaduj każdy serwis
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
  
  /**
   * Ładuje konkretny serwis
   */
  async loadService(name: string, version: string): Promise<ServiceDefinition | null> {
    try {
      const serviceDir = path.join(this.servicesDir, `${name}-v${version}`);
      const indexFile = path.join(serviceDir, 'index.dsl.ts');
      
      if (!await fileExists(indexFile)) {
        console.error(`Service ${name} v${version} not found`);
        return null;
      }
      
      // Waliduj tylko pliki tego serwisu
      const validationErrors = await validateDslFiles(serviceDir);
      if (validationErrors.length > 0) {
        console.error(`DSL validation errors for ${name}-v${version}:`);
        validationErrors.forEach(err => {
          console.error(`${err.file}: ${err.error}`);
        });
        throw new Error(`DSL validation failed for ${name}-v${version}`);
      }
      
      const serviceDef = await import(indexFile);
      const serviceDefault = serviceDef.default;
      
      const serviceKey = `${name}-v${version}`;
      this.services.set(serviceKey, serviceDefault);
      
      return serviceDefault;
    } catch (error) {
      console.error(`Failed to load service ${name} v${version}:`, error);
      return null;
    }
  }
  
  /**
   * Wczytuje dane testowe dla serwisu
   */
  async loadTestDataForService(serviceName: string, version: string): Promise<Record<string, any[]>> {
    const serviceKey = `${serviceName}-v${version}`;
    const service = this.services.get(serviceKey);
    
    if (!service) {
      throw new Error(`Service ${serviceKey} not loaded`);
    }
    
    if (!service.config.testData?.enabled) {
      return {};
    }
    
    const testDataPath = path.join(
      this.servicesDir, 
      `${serviceName}-v${version}`, 
      service.config.testData.path
    );
    
    const testDataFiles = await glob(`${testDataPath}/**/*.json`);
    const testData: Record<string, any[]> = {};
    
    for (const file of testDataFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const data = JSON.parse(content);
        const modelName = path.basename(file, '.data.json');
        testData[modelName] = data;
      } catch (error) {
        console.error(`Failed to load test data from ${file}:`, error);
      }
    }
    
    return testData;
  }
  
  /**
   * Ładuje tłumaczenia dla serwisu
   */
  async loadTranslationsForService(serviceName: string, version: string): Promise<Record<string, any>> {
    const serviceKey = `${serviceName}-v${version}`;
    const service = this.services.get(serviceKey);
    
    if (!service) {
      throw new Error(`Service ${serviceKey} not loaded`);
    }
    
    const i18nConfig = service.config.i18n;
    if (!i18nConfig) {
      return {};
    }
    
    const i18nDir = path.join(
      this.servicesDir, 
      `${serviceName}-v${version}`, 
      'i18n'
    );
    
    const translations: Record<string, any> = {};
    
    for (const locale of i18nConfig.supportedLocales) {
      try {
        const localeFile = path.join(i18nDir, `${locale}.mo`);
        // W przypadku prawdziwej implementacji należałoby użyć odpowiedniej
        // biblioteki do parsowania plików .mo, ale tutaj pomiń to dla uproszczenia
        translations[locale] = { path: localeFile };
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
      }
    }
    
    return translations;
  }
  
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }
  
  getService(name: string, version: string): ServiceDefinition | undefined {
    return this.services.get(`${name}-v${version}`);
  }
  
  getAllServices(): ServiceDefinition[] {
    return Array.from(this.services.values());
  }
}

// Pomocnicza funkcja do sprawdzania istnienia pliku
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}


# Rozszerzona struktura TokenDSL

```
project-root/
├── dsl/                                # Katalog główny dla definicji DSL
│   ├── users-service-v1.0/             # Serwis users w wersji 1.0
│   │   ├── index.dsl.ts                # Główny plik definicji serwisu
│   │   ├── models/                     # Modele danych
│   │   │   ├── user.model.dsl.ts       # Model użytkownika
│   │   │   └── role.model.dsl.ts       # Model roli
│   │   ├── endpoints/                  # Endpointy
│   │   │   ├── users.endpoints.dsl.ts  # Endpointy użytkowników
│   │   │   └── auth.endpoints.dsl.ts   # Endpointy autoryzacji
│   │   ├── i18n/                       # Tłumaczenia
│   │   │   ├── en.mo                   # Angielskie tłumaczenia
│   │   │   ├── pl.mo                   # Polskie tłumaczenia
│   │   │   └── i18n.dsl.ts             # Konfiguracja i18n
│   │   ├── test-data/                  # Przykładowe dane testowe
│   │   │   ├── users.data.json         # Dane użytkowników
│   │   │   └── roles.data.json         # Dane ról
│   │   └── service.config.dsl.ts       # Konfiguracja serwisu
│   ├── orders-service-v2.0/            # Serwis orders w wersji 2.0
│   │   ├── index.dsl.ts
│   │   ├── models/
│   │   ├── endpoints/
│   │   ├── i18n/
│   │   ├── test-data/
│   │   └── service.config.dsl.ts
│   └── common/                         # Współdzielone zasoby
│       ├── models/                     # Współdzielone modele
│       ├── middlewares/                # Współdzielone middleware
│       └── validators/                 # Współdzielone walidatory
├── src/                                # Kod źródłowy backendu
│   ├── server.ts                       # Główny serwer
│   ├── dsl-loader.ts                   # Loader dla plików DSL
│   ├── dsl-validator.ts                # Walidator DSL
│   └── services-manager.ts             # Zarządzanie wieloma serwisami
├── config/                             # Konfiguracja projektu
│   ├── server.config.ts                # Konfiguracja serwera
│   └── services.config.ts              # Konfiguracja serwisów
└── dist/                               # Skompilowane pliki
```

## Struktura plików DSL

### 1. Główny plik definicji serwisu (`index.dsl.ts`)

```typescript
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

### 2. Konfiguracja serwisu (`service.config.dsl.ts`)

```typescript
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

### 3. Definicja modelu (`user.model.dsl.ts`)

```typescript
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
          // Walidacja unikalności emaila
          return true;
        }
      }
    ]
  }
});
```

### 4. Definicja endpointów (`users.endpoints.dsl.ts`)

```typescript
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
      ttl: 60 // 60 sekund
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

### 5. Konfiguracja i18n (`i18n.dsl.ts`)

```typescript
import { defineI18n } from '@tokendsl/core';

export default defineI18n({
  defaultLocale: 'en',
  locales: {
    en: './en.mo',
    pl: './pl.mo'
  },
  namespaces: [
    'common',
    'users',
    'auth',
    'errors'
  ]
});
```

### 6. Dane testowe (`users.data.json`)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "email": "admin@example.com",
    "password": "$2b$10$...",
    "role": "admin",
    "createdAt": "2023-01-01T00:00:00Z",
    "updatedAt": "2023-01-01T00:00:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "username": "user1",
    "email": "user1@example.com",
    "password": "$2b$10$...",
    "role": "user",
    "createdAt": "2023-01-02T00:00:00Z",
    "updatedAt": "2023-01-02T00:00:00Z"
  }
]
```

## Walidator DSL

```typescript
// src/dsl-validator.ts
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import glob from 'glob-promise';

// Schemat modelu
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

// Schemat endpointu
const EndpointSchema = z.object({
  description: z.string(),
  version: z.string(),
  tags: z.array(z.string()),
  auth: z.optional(z.object({
    required: z.boolean(),
    roles: z.optional(z.array(z.string()))
  })),
  input: z.any(), // Zod schema
  output: z.any(), // Zod schema
  handler: z.string(),
  i18n: z.optional(z.object({
    messages: z.record(z.string())
  })),
  docs: z.optional(z.object({
    examples: z.record(z.object({
      ref: z.string()
    }))
  })),
  caching: z.optional(z.object({
    enabled: z.boolean(),
    ttl: z.number()
  })),
  validation: z.optional(z.object({
    custom: z.array(z.string())
  })),
  uiSchema: z.optional(z.object({
    layout: z.string(),
    fields: z.record(z.object({
      type: z.string(),
      label: z.string(),
      options: z.optional(z.array(z.object({
        value: z.any(),
        label: z.string()
      })))
    }))
  }))
});

// Schemat serwisu
const ServiceSchema = z.object({
  name: z.string(),
  version: z.string(),
  config: z.any(), // ServiceConfig
  endpoints: z.record(z.any())
});

// Schemat konfiguracji serwisu
const ServiceConfigSchema = z.object({
  port: z.number(),
  basePath: z.string(),
  cors: z.object({
    enabled: z.boolean(),
    origins: z.array(z.string())
  }),
  docs: z.object({
    enabled: z.boolean(),
    path: z.string()
  }),
  i18n: z.object({
    defaultLocale: z.string(),
    supportedLocales: z.array(z.string())
  }),
  testData: z.object({
    enabled: z.boolean(),
    path: z.string()
  })
});

export async function validateDslFiles(rootDir: string) {
  const errors: Array<{ file: string, error: string }> = [];
  
  // Znajdź wszystkie pliki DSL
  const files = await glob(`${rootDir}/**/*.dsl.ts`);
  
  for (const file of files) {
    try {
      // Importuj plik DSL
      const dslModule = await import(file);
      const dslDefault = dslModule.default;
      
      // Sprawdź typ DSL i zwaliduj
      if (file.includes('model')) {
        ModelSchema.parse(dslDefault || dslModule);
      } else if (file.includes('endpoints')) {
        // Walidacja każdego endpointu
        const endpoints = dslDefault || dslModule;
        for (const [path, endpoint] of Object.entries(endpoints)) {
          EndpointSchema.parse(endpoint);
        }
      } else if (file.includes('index.dsl.ts')) {
        ServiceSchema.parse(dslDefault);
      } else if (file.includes('service.config.dsl.ts')) {
        ServiceConfigSchema.parse(dslDefault || dslModule.serviceConfig);
      }
    } catch (error) {
      errors.push({
        file,
        error: error.message
      });
    }
  }
  
  return errors;
}

// src/dsl-loader.ts
import { promises as fs } from 'fs';
import path from 'path';
import glob from 'glob-promise';
import { validateDslFiles } from './dsl-validator';

export interface ServiceDefinition {
  name: string;
  version: string;
  config: any;
  endpoints: Record<string, any>;
}

export class DslLoader {
  private servicesDir: string;
  private services: Map<string, ServiceDefinition> = new Map();

  constructor(servicesDir: string) {
    this.servicesDir = servicesDir;
  }

  /**
   * Ładuje wszystkie serwisy DSL z katalogu
   */
  async loadAllServices(): Promise<Map<string, ServiceDefinition>> {
    // Znajdź wszystkie pliki index.dsl.ts
    const serviceFiles = await glob(`${this.servicesDir}/**/index.dsl.ts`);
    
    // Najpierw walidacja
    const validationErrors = await validateDslFiles(this.servicesDir);
    if (validationErrors.length > 0) {
      console.error('DSL validation errors:');
      validationErrors.forEach(err => {
        console.error(`${err.file}: ${err.error}`);
      });
      throw new Error('DSL validation failed');
    }
    
    // Załaduj każdy serwis
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
  
  /**
   * Ładuje konkretny serwis
   */
  async loadService(name: string, version: string): Promise<ServiceDefinition | null> {
    try {
      const serviceDir = path.join(this.servicesDir, `${name}-v${version}`);
      const indexFile = path.join(serviceDir, 'index.dsl.ts');
      
      if (!await fileExists(indexFile)) {
        console.error(`Service ${name} v${version} not found`);
        return null;
      }
      
      // Waliduj tylko pliki tego serwisu
      const validationErrors = await validateDslFiles(serviceDir);
      if (validationErrors.length > 0) {
        console.error(`DSL validation errors for ${name}-v${version}:`);
        validationErrors.forEach(err => {
          console.error(`${err.file}: ${err.error}`);
        });
        throw new Error(`DSL validation failed for ${name}-v${version}`);
      }
      
      const serviceDef = await import(indexFile);
      const serviceDefault = serviceDef.default;
      
      const serviceKey = `${name}-v${version}`;
      this.services.set(serviceKey, serviceDefault);
      
      return serviceDefault;
    } catch (error) {
      console.error(`Failed to load service ${name} v${version}:`, error);
      return null;
    }
  }
  
  /**
   * Wczytuje dane testowe dla serwisu
   */
  async loadTestDataForService(serviceName: string, version: string): Promise<Record<string, any[]>> {
    const serviceKey = `${serviceName}-v${version}`;
    const service = this.services.get(serviceKey);
    
    if (!service) {
      throw new Error(`Service ${serviceKey} not loaded`);
    }
    
    if (!service.config.testData?.enabled) {
      return {};
    }
    
    const testDataPath = path.join(
      this.servicesDir, 
      `${serviceName}-v${version}`, 
      service.config.testData.path
    );
    
    const testDataFiles = await glob(`${testDataPath}/**/*.json`);
    const testData: Record<string, any[]> = {};
    
    for (const file of testDataFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        const data = JSON.parse(content);
        const modelName = path.basename(file, '.data.json');
        testData[modelName] = data;
      } catch (error) {
        console.error(`Failed to load test data from ${file}:`, error);
      }
    }
    
    return testData;
  }
  
  /**
   * Ładuje tłumaczenia dla serwisu
   */
  async loadTranslationsForService(serviceName: string, version: string): Promise<Record<string, any>> {
    const serviceKey = `${serviceName}-v${version}`;
    const service = this.services.get(serviceKey);
    
    if (!service) {
      throw new Error(`Service ${serviceKey} not loaded`);
    }
    
    const i18nConfig = service.config.i18n;
    if (!i18nConfig) {
      return {};
    }
    
    const i18nDir = path.join(
      this.servicesDir, 
      `${serviceName}-v${version}`, 
      'i18n'
    );
    
    const translations: Record<string, any> = {};
    
    for (const locale of i18nConfig.supportedLocales) {
      try {
        const localeFile = path.join(i18nDir, `${locale}.mo`);
        // W przypadku prawdziwej implementacji należałoby użyć odpowiedniej
        // biblioteki do parsowania plików .mo, ale tutaj pomiń to dla uproszczenia
        translations[locale] = { path: localeFile };
      } catch (error) {
        console.error(`Failed to load translations for ${locale}:`, error);
      }
    }
    
    return translations;
  }
  
  getServiceNames(): string[] {
    return Array.from(this.services.keys());
  }
  
  getService(name: string, version: string): ServiceDefinition | undefined {
    return this.services.get(`${name}-v${version}`);
  }
  
  getAllServices(): ServiceDefinition[] {
    return Array.from(this.services.values());
  }
}

// Pomocnicza funkcja do sprawdzania istnienia pliku
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// src/services-manager.ts
import { Express } from 'express';
import path from 'path';
import { DslLoader, ServiceDefinition } from './dsl-loader';
import { createExpressRouter } from './frameworks/express';
import { createFastifyPlugin } from './frameworks/fastify';
import { loadTranslations } from './i18n/loader';

interface ServicesManagerOptions {
  servicesDir: string;
  framework: 'express' | 'fastify' | 'koa';
  serverOptions?: any;
}

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
   * Inicjalizuje manager serwisów
   */
  async initialize(): Promise<void> {
    await this.loader.loadAllServices();
    console.log(`Loaded ${this.loader.getServiceNames().length} services`);
  }

  /**
   * Uruchamia wszystkie serwisy
   */
  async startAllServices(): Promise<void> {
    const services = this.loader.getAllServices();
    
    for (const service of services) {
      await this.startService(service.name, service.version);
    }
  }

  /**
   * Uruchamia konkretny serwis
   */
  async startService(name: string, version: string): Promise<void> {
    const service = this.loader.getService(name, version);
    if (!service) {
      throw new Error(`Service ${name}-v${version} not found`);
    }
    
    const serviceKey = `${name}-v${version}`;
    
    // Sprawdź, czy serwis jest już uruchomiony
    if (this.runningServices.has(serviceKey)) {
      console.log(`Service ${serviceKey} is already running`);
      return;
    }
    
    // Załaduj dane testowe
    const testData = await this.loader.loadTestDataForService(name, version);
    
    // Załaduj tłumaczenia
    const translations = await this.loader.loadTranslationsForService(name, version);
    const i18nInstance = await loadTranslations(translations, service.config.i18n);
    
    // Uruchom serwis w zależności od wybranego frameworka
    switch (this.options.framework) {
      case 'express':
        await this.startExpressService(service, testData, i18nInstance);
        break;
      case 'fastify':
        await this.startFastifyService(service, testData, i18nInstance);
        break;
      case 'koa':
        await this.startKoaService(service, testData, i18nInstance);
        break;
      default:
        throw new Error(`Unsupported framework: ${this.options.framework}`);
    }
  }

  /**
   * Zatrzymuje wszystkie serwisy
   */
  async stopAllServices(): Promise<void> {
    const promises: Promise<void>[] = [];
    
    for (const [serviceKey, serviceInfo] of this.runningServices.entries()) {
      console.log(`Stopping service: ${serviceKey}`);
      promises.push(new Promise((resolve) => {
        serviceInfo.server.close(() => {
          console.log(`Service ${serviceKey} stopped`);
          resolve();
        });
      }));
    }
    
    await Promise.all(promises);
    this.runningServices.clear();
  }

  /**
   * Zatrzymuje konkretny serwis
   */
  async stopService(name: string, version: string): Promise<void> {
    const serviceKey = `${name}-v${version}`;
    const serviceInfo = this.runningServices.get(serviceKey);
    
    if (!serviceInfo) {
      console.log(`Service ${serviceKey} is not running`);
      return;
    }
    
    await new Promise<void>((resolve) => {
      serviceInfo.server.close(() => {
        console.log(`Service ${serviceKey} stopped`);
        this.runningServices.delete(serviceKey);
        resolve();
      });
    });
  }

  /**
   * Restartuje konkretny serwis
   */
  async restartService(name: string, version: string): Promise<void> {
    await this.stopService(name, version);
    await this.startService(name, version);
  }

  /**
   * Uruchamia serwis w Express
   */
  private async startExpressService(
    service: ServiceDefinition,
    testData: Record<string, any[]>,
    i18n: any
  ): Promise<void> {
    const express = require('express');
    const app = express();
    
    // Konfiguracja podstawowych middleware
    app.use(express.json());
    
    if (service.config.cors?.enabled) {
      const cors = require('cors');
      app.use(cors({
        origin: service.config.cors.origins,
        credentials: true
      }));
    }
    
    // Dodaj middleware i18n
    app.use((req, res, next) => {
      req.i18n = i18n;
      req.testData = testData;
      next();
    });
    
    // Utwórz router Express dla serwisu
    const router = createExpressRouter(service);
    app.use(service.config.basePath, router);
    
    // Dokumentacja API
    if (service.config.docs?.enabled) {
      const swaggerUi = require('swagger-ui-express');
      const openApiSpec = generateOpenApiSpec(service);
      app.use(service.config.docs.path, swaggerUi.serve, swaggerUi.setup(openApiSpec));
    }
    
    // Uruchom serwer
    const port = service.config.port;
    const server = app.listen(port, () => {
      console.log(`Service ${service.name}-v${service.version} running on port ${port}`);
    });
    
    // Zapisz informacje o uruchomionym serwisie
    this.runningServices.set(`${service.name}-v${service.version}`, {
      port,
      server
    });
  }

  /**
   * Uruchamia serwis w Fastify
   */
  private async startFastifyService(
    service: ServiceDefinition,
    testData: Record<string, any[]>,
    i18n: any
  ): Promise<void> {
    const fastify = require('fastify')({
      logger: true
    });
    
    // Konfiguracja CORS
    if (service.config.cors?.enabled) {
      await fastify.register(require('@fastify/cors'), {
        origin: service.config.cors.origins,
        credentials: true
      });
    }
    
    // Dodaj dekorator dla i18n i testData
    fastify.decorateRequest('i18n', null);
    fastify.decorateRequest('testData', null);
    
    fastify.addHook('onRequest', (req, reply, done) => {
      req.i18n = i18n;
      req.testData = testData;
      done();
    });
    
    // Utwórz plugin Fastify dla serwisu