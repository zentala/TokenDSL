# Vision 0.2 - Users Module Architecture

## 📁 Struktura katalogów
```
src/
  examples/
    users/
      index.ts           # Eksport głównego API
      api.ts            # Definicja API
      handlers/         # Handlery endpointów
        create.ts
        read.ts
        update.ts
        delete.ts
      schemas/          # Schematy walidacji
        user.schema.ts
        create.schema.ts
        update.schema.ts
      storage/          # Warstwa przechowywania danych
        memory.ts       # Implementacja w pamięci
        types.ts        # Typy dla storage
      docs/            # Dokumentacja
        swagger.ts      # Dokumentacja Swagger
        examples.ts     # Przykłady użycia
      ui/              # Schematy UI
        forms.ts        # Schematy formularzy
        tables.ts       # Schematy tabel
        cards.ts        # Schematy kart
      tests/           # Testy
        api.test.ts     # Testy API
        handlers.test.ts # Testy handlerów
        storage.test.ts # Testy storage
```

## 🔧 Komponenty

### 1. API Definition (`api.ts`)
```typescript
import { defineApi } from '../../engine';
import { createHandler } from './handlers/create';
import { readHandler } from './handlers/read';
import { updateHandler } from './handlers/update';
import { deleteHandler } from './handlers/delete';
import { userSchema, createSchema, updateSchema } from './schemas';
import { swaggerDocs } from './docs/swagger';
import { uiSchemas } from './ui';

export const userApi = defineApi({
  endpoints: [
    {
      method: 'GET',
      path: '/api/users',
      description: 'Get all users',
      tags: ['users'],
      handler: readHandler.getAll,
      ...swaggerDocs.getAll,
      ...uiSchemas.table
    },
    // ... pozostałe endpointy
  ]
});
```

### 2. Schematy (`schemas/`)
```typescript
// user.schema.ts
import { z } from 'zod';

export const userSchema = z.object({
  id: z.string(),
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(0).max(150),
  createdAt: z.date(),
  updatedAt: z.date()
});

// create.schema.ts
export const createSchema = userSchema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
});

// update.schema.ts
export const updateSchema = createSchema.partial();
```

### 3. Handlery (`handlers/`)
```typescript
// create.ts
import { storage } from '../storage';
import { createSchema } from '../schemas';

export const createHandler = {
  async create(data: z.infer<typeof createSchema>) {
    const user = await storage.create(data);
    return user;
  }
};
```

### 4. Storage (`storage/`)
```typescript
// types.ts
export interface UserStorage {
  create(data: CreateUserData): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<boolean>;
}

// memory.ts
export class MemoryUserStorage implements UserStorage {
  private users = new Map<string, User>();
  
  async create(data: CreateUserData): Promise<User> {
    const user = {
      id: generateId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }
  // ... implementacja pozostałych metod
}
```

### 5. Dokumentacja (`docs/`)
```typescript
// swagger.ts
export const swaggerDocs = {
  getAll: {
    summary: 'Get all users',
    description: 'Returns a list of all users in the system',
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: { $ref: '#/components/schemas/User' }
            }
          }
        }
      }
    }
  }
  // ... dokumentacja pozostałych endpointów
};
```

### 6. UI Schematy (`ui/`)
```typescript
// forms.ts
export const userFormSchema = {
  layout: 'form',
  fields: {
    name: {
      type: 'text',
      label: 'Full name',
      validation: {
        minLength: 2
      }
    },
    email: {
      type: 'email',
      label: 'Email address'
    },
    age: {
      type: 'number',
      label: 'Age',
      validation: {
        min: 0,
        max: 150
      }
    }
  }
};
```

## 🎯 Cele i Ulepszenia

1. **Modularyzacja**
   - Każdy komponent ma jedno zadanie
   - Łatwiejsze testowanie
   - Łatwiejsze utrzymanie

2. **Rozszerzalność**
   - Możliwość dodania nowych implementacji storage
   - Możliwość dodania nowych schematów UI
   - Łatwe dodawanie nowych endpointów

3. **Dokumentacja**
   - Pełna dokumentacja Swagger
   - Przykłady użycia
   - Schematy UI dla różnych kontekstów

4. **Testy**
   - Testy dla każdego komponentu
   - Testy integracyjne
   - Testy storage

5. **Walidacja**
   - Rozbudowane schematy Zod
   - Walidacja na poziomie API
   - Walidacja na poziomie UI

## 📝 Następne Kroki

1. [ ] Stworzyć strukturę katalogów
2. [ ] Zaimplementować podstawowe komponenty
3. [ ] Dodać testy
4. [ ] Dodać dokumentację
5. [ ] Dodać schematy UI
6. [ ] Dodać przykłady użycia
7. [ ] Dodać obsługę błędów
8. [ ] Dodać logowanie
9. [ ] Dodać monitoring 