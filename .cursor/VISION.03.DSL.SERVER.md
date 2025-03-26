# Vision 0.3 - DSL Server Architecture

## 📁 Struktura katalogów
```
src/
  server/
    index.dsl.ts       # Główny DSL serwera
    config.dsl.ts      # Konfiguracja serwera
    types.dsl.ts       # Typy dla DSL
    compiler/         # Kompilator DSL
      parser.ts       # Parser DSL
      validator.ts    # Walidator DSL
      generator.ts    # Generator kodu
    runtime/         # Runtime dla DSL
      loader.ts      # Ładowanie DSL
      executor.ts    # Wykonawca DSL
      context.ts     # Kontekst wykonania
    utils/          # Narzędzia
      logger.ts     # Logger
      metrics.ts    # Metryki
      errors.ts     # Obsługa błędów

examples/
  blog-server/      # Przykładowy serwer blogowy
    index.dsl.ts   # Główny DSL serwera
    users.dsl.ts   # DSL dla użytkowników
    posts.dsl.ts   # DSL dla postów
    comments.dsl.ts # DSL dla komentarzy
    config/       # Konfiguracje
      dev.dsl.ts
      prod.dsl.ts
    types/        # Typy
      common.dsl.ts
    schemas/      # Schematy
      user.dsl.ts
      post.dsl.ts
    handlers/     # Handlery
      user.dsl.ts
      post.dsl.ts
    storage/      # Storage
      memory.dsl.ts
      db.dsl.ts
    ui/          # UI
      forms.dsl.ts
      pages.dsl.ts
```

## 🔧 Komponenty

### 1. Główny DSL Serwera (`index.dsl.ts`)
```typescript
import { defineServer } from '@tokendsl/server';
import { users } from './users.dsl';
import { posts } from './posts.dsl';
import { comments } from './comments.dsl';
import { devConfig } from './config/dev.dsl';

export default defineServer({
  name: 'blog-server',
  version: '1.0.0',
  config: devConfig,
  modules: [
    users,
    posts,
    comments
  ],
  middleware: [
    logger,
    cors,
    auth
  ],
  storage: {
    type: 'memory',
    options: {}
  }
});
```

### 2. DSL Modułu (`users.dsl.ts`)
```typescript
import { defineModule } from '@tokendsl/server';
import { userSchema } from './schemas/user.dsl';
import { userHandlers } from './handlers/user.dsl';
import { userStorage } from './storage/memory.dsl';
import { userUI } from './ui/forms.dsl';

export const users = defineModule({
  name: 'users',
  version: '1.0.0',
  schema: userSchema,
  handlers: userHandlers,
  storage: userStorage,
  ui: userUI,
  routes: {
    'GET /api/users': 'getAll',
    'POST /api/users': 'create',
    'GET /api/users/:id': 'getById',
    'PUT /api/users/:id': 'update',
    'DELETE /api/users/:id': 'delete'
  }
});
```

### 3. DSL Schematu (`schemas/user.dsl.ts`)
```typescript
import { defineSchema } from '@tokendsl/server';

export const userSchema = defineSchema({
  name: 'User',
  fields: {
    id: {
      type: 'string',
      required: true,
      primary: true
    },
    name: {
      type: 'string',
      required: true,
      minLength: 2
    },
    email: {
      type: 'string',
      required: true,
      format: 'email'
    },
    createdAt: {
      type: 'date',
      required: true,
      auto: true
    }
  }
});
```

### 4. DSL Handlera (`handlers/user.dsl.ts`)
```typescript
import { defineHandler } from '@tokendsl/server';

export const userHandlers = defineHandler({
  name: 'user',
  methods: {
    getAll: async (context) => {
      const users = await context.storage.findAll();
      return users;
    },
    create: async (context, data) => {
      const user = await context.storage.create(data);
      return user;
    }
  }
});
```

### 5. DSL Storage (`storage/memory.dsl.ts`)
```typescript
import { defineStorage } from '@tokendsl/server';

export const userStorage = defineStorage({
  name: 'memory',
  type: 'memory',
  methods: {
    findAll: async () => {
      return Array.from(users.values());
    },
    create: async (data) => {
      const user = {
        id: generateId(),
        ...data,
        createdAt: new Date()
      };
      users.set(user.id, user);
      return user;
    }
  }
});
```

### 6. DSL UI (`ui/forms.dsl.ts`)
```typescript
import { defineUI } from '@tokendsl/server';

export const userUI = defineUI({
  name: 'user',
  forms: {
    create: {
      fields: {
        name: {
          type: 'text',
          label: 'Name',
          required: true
        },
        email: {
          type: 'email',
          label: 'Email',
          required: true
        }
      }
    }
  }
});
```

## 🔄 Proces Kompilacji

1. **Parsowanie DSL**
   - Wczytanie plików DSL
   - Parsowanie składni DSL
   - Walidacja struktury

2. **Walidacja**
   - Sprawdzenie typów
   - Sprawdzenie zależności
   - Sprawdzenie konfiguracji

3. **Generowanie Kodu**
   - Generowanie typów TypeScript
   - Generowanie handlerów
   - Generowanie UI
   - Generowanie dokumentacji

4. **Runtime**
   - Ładowanie skompilowanych modułów
   - Inicjalizacja kontekstu
   - Uruchomienie serwera

## 🎯 Cele i Ulepszenia

1. **Modularyzacja**
   - Każdy moduł to osobny DSL
   - Łatwe dodawanie nowych modułów
   - Łatwe testowanie

2. **Rozszerzalność**
   - Możliwość dodania nowych typów DSL
   - Możliwość dodania nowych generatorów
   - Możliwość dodania nowych runtime'ów

3. **Dokumentacja**
   - Automatyczna generacja dokumentacji
   - Przykłady użycia
   - Schematy UI

4. **Testy**
   - Testy dla kompilatora
   - Testy dla runtime'u
   - Testy dla modułów

## 📝 Następne Kroki

1. [ ] Stworzyć podstawową strukturę kompilatora
2. [ ] Zaimplementować parser DSL
3. [ ] Zaimplementować walidator
4. [ ] Zaimplementować generator
5. [ ] Zaimplementować runtime
6. [ ] Stworzyć przykładowy serwer
7. [ ] Dodać testy
8. [ ] Dodać dokumentację
9. [ ] Dodać przykłady 