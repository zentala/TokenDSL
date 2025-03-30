# TokenDSL: Token-Efficient Backend DSL for AI-Integrated Development

## 🎯 Cel
TokenDSL to kompleksowy system do definiowania, walidowania i wdrażania API w sposób efektywny pod względem tokenów i przyjazny dla modeli AI. Projekt integruje wiele zaawansowanych koncepcji:

- ✍️ Minimalizacja ilości kodu boilerplate
- ✅ Automatyczna walidacja i wnioskowanie typów
- 🔄 Współdzielenie typów między backendem a frontendem
- 🤝 Przyjazność dla LLM/agentów (struktura XML/JSON)
- 🔄 Minimalizacja użycia tokenów
- 🧠 Jeden źródłowy plik per endpoint
- 🧩 Wsparcie dla metadanych UI, commitów i wnioskowania LLM
- 🎨 Deklaratywne wskazówki UI w stylu MUI

## 🏗️ Architektura

### 1. Warstwy Systemu
- **Warstwa definicji DSL** (pliki .dsl.ts)
- **Warstwa przetwarzania** (loader, walidator, generator)
- **Warstwa wdrożeń API** (generowane serwery)
- **Warstwa klientów** (frontend, dokumentacja)

### 2. Struktura Projektu
```
project-root/
├── dsl/                                # Katalog główny dla definicji DSL
│   ├── users-service-v1.0/             # Serwis users w wersji 1.0
│   │   ├── index.dsl.ts                # Główny plik definicji serwisu
│   │   ├── models/                     # Modele danych
│   │   ├── endpoints/                  # Endpointy
│   │   ├── i18n/                       # Tłumaczenia
│   │   ├── test-data/                  # Przykładowe dane testowe
│   │   └── service.config.dsl.ts       # Konfiguracja serwisu
│   └── common/                         # Współdzielone zasoby
├── src/                                # Kod źródłowy
├── config/                             # Konfiguracja projektu
└── dist/                               # Skompilowane pliki
```

### 3. Stack Technologiczny
- **Język**: TypeScript
- **Walidacja**: [Zod](https://zod.dev)
- **API Definition**: Custom DSL via `defineApi()`
- **Routing**: Express/Fastify
- **ORM (opcjonalnie)**: Prisma
- **Type Sharing**: `zod-to-ts` lub `tsup`
- **UI Schema Support**: Deklaratywna konfiguracja dla bibliotek frontendowych

## 📦 Przykład DSL

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

## ⚙️ Silnik Runtime (`dsl-engine.ts`)

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

## 🌟 Kluczowe Funkcje

### 1. Wersjonowanie API
- Struktura katalogów oparta na nazwach serwisów i wersjach
- Wsparcie dla wielu wersji tego samego API działających równolegle
- Automatyczne zarządzanie wersjami w routingu

### 2. Internacjonalizacja (i18n)
- Pliki tłumaczeń w formacie .mo dla każdego serwisu
- Wsparcie dla wielu języków w komunikatach i dokumentacji
- Automatyczne zarządzanie tłumaczeniami w DSL

### 3. Dane Testowe
- Wbudowane dane demonstracyjne dla każdego modelu
- Możliwość automatycznego zasilania środowiska deweloperskiego
- Generowanie przykładowych danych na podstawie schematów

### 4. Walidacja
- Automatyczna walidacja plików DSL
- Sprawdzanie poprawności typów
- Weryfikacja zależności między serwisami
- Walidacja schematów UI

### 5. Wsparcie dla Platform
- Express
- Fastify
- Koa
- Możliwość dodawania nowych platform

### 6. Generowanie UI
- Automatyczne tworzenie schematów UI
- Wsparcie dla różnych bibliotek komponentów
- Dostosowywanie wyglądu przez motywy

## 🎨 Frontend

### 1. Komponenty
- Podstawowe komponenty UI (Button, Input, Card)
- Komponenty formularzy (Form, Select, Checkbox)
- Komponenty layoutu (Grid, Stack, Modal)
- Komponenty danych (Table, Chart, Calendar)

### 2. Motywy
- Light - jasny motyw domyślny
- Dark - ciemny motyw
- Custom - możliwość tworzenia własnych motywów

### 3. DSL dla Frontendu
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

## 🔄 Integracja z Backendem

### 1. Współdzielenie Typów
- Bezpośrednie wykorzystanie schematów (monorepo)
- Kompilacja z `zod-to-ts`
- Automatyczna synchronizacja typów

### 2. API Endpointy
- GET /api/components
- GET /api/examples
- POST /api/validate
- GET /api/themes
- POST /api/preview

### 3. Dane
- Pobieranie z backendu TokenDSL
- Automatyczna synchronizacja schematów
- Wsparcie dla wersjonowania API

## 🛠️ Narzędzia Deweloperskie

### 1. CLI
- Generowanie nowych serwisów
- Walidacja plików DSL
- Generowanie dokumentacji
- Zarządzanie wersjami

### 2. VS Code Plugin
- Podświetlanie składni DSL
- Auto-uzupełnianie
- Podgląd komponentów
- Walidacja na żywo

### 3. Debugowanie
- React DevTools
- Network panel
- Console
- Sources

## 🧪 Testowanie

### 1. Testy Jednostkowe
- Komponenty
- Funkcje pomocnicze
- Walidatory

### 2. Testy Integracyjne
- API
- DSL
- Motywy

### 3. Testy E2E
- Scenariusze użycia
- Przepływy użytkownika
- Responsywność

## 📈 Plan Rozwoju

### 1. Faza 1: Podstawy
- Implementacja podstawowego DSL
- Generowanie typów
- Walidacja schematów

### 2. Faza 2: Frontend
- Generowanie komponentów UI
- System motywów
- Integracja z backendem

### 3. Faza 3: Narzędzia
- CLI
- VS Code plugin
- Dokumentacja

### 4. Faza 4: Rozszerzenia
- Wsparcie dla nowych platform
- Dodatkowe komponenty
- Optymalizacje wydajności

## 🤝 Wnioski i Rekomendacje

### 1. Priorytety
- Skupienie na token-efektywności
- Zachowanie prostoty DSL
- Dobre wsparcie dla TypeScript

### 2. Wyzwania
- Balans między elastycznością a prostotą
- Optymalizacja wydajności
- Zarządzanie wersjami

### 3. Następne Kroki
1. Implementacja podstawowego DSL
2. Stworzenie generatora typów
3. Rozwój narzędzi deweloperskich
4. Budowa ekosystemu komponentów

## 📝 Notatki do Uzupełnienia
1. Szczegółowa dokumentacja API
2. Przykłady użycia dla każdego komponentu
3. Wzorce projektowe i najlepsze praktyki
4. Przewodnik migracji z innych rozwiązań
5. Dokumentacja wydajności i skalowania







# TokenDSL - Wizja Projektu

## 🎯 Cel
TokenDSL to kompleksowy system do definiowania, walidowania i wdrażania API w sposób efektywny pod względem tokenów i przyjazny dla modeli AI. Projekt integruje wiele zaawansowanych koncepcji:

## 🏗️ Architektura

### 1. Warstwowa Struktura
- **Warstwa definicji DSL** (pliki .dsl.ts)
- **Warstwa przetwarzania** (loader, walidator, generator)
- **Warstwa wdrożeń API** (generowane serwery)
- **Warstwa klientów** (frontend, dokumentacja)

### 2. Struktura Projektu
```
project-root/
├── dsl/                                # Katalog główny dla definicji DSL
│   ├── users-service-v1.0/             # Serwis users w wersji 1.0
│   │   ├── index.dsl.ts                # Główny plik definicji serwisu
│   │   ├── models/                     # Modele danych
│   │   ├── endpoints/                  # Endpointy
│   │   ├── i18n/                       # Tłumaczenia
│   │   ├── test-data/                  # Przykładowe dane testowe
│   │   └── service.config.dsl.ts       # Konfiguracja serwisu
│   └── common/                         # Współdzielone zasoby
├── src/                                # Kod źródłowy
├── config/                             # Konfiguracja projektu
└── dist/                               # Skompilowane pliki
```

## 🔧 Technologie

### Stack
- **Język**: TypeScript
- **Walidacja**: [Zod](https://zod.dev)
- **API Definition**: Custom DSL via `defineApi()`
- **Routing**: Express/Fastify
- **ORM (opcjonalnie)**: Prisma
- **Type Sharing**: `zod-to-ts` lub `tsup`
- **UI Schema Support**: Deklaratywna konfiguracja dla bibliotek frontendowych

## 🌟 Kluczowe Funkcje

### 1. Wersjonowanie API
- Struktura katalogów oparta na nazwach serwisów i wersjach
- Wsparcie dla wielu wersji tego samego API działających równolegle
- Automatyczne zarządzanie wersjami w routingu

### 2. Internacjonalizacja (i18n)
- Pliki tłumaczeń w formacie .mo dla każdego serwisu
- Wsparcie dla wielu języków w komunikatach i dokumentacji
- Automatyczne zarządzanie tłumaczeniami w DSL

### 3. Dane Testowe
- Wbudowane dane demonstracyjne dla każdego modelu
- Możliwość automatycznego zasilania środowiska deweloperskiego
- Generowanie przykładowych danych na podstawie schematów

### 4. Walidacja
- Automatyczna walidacja plików DSL
- System typów oparty na Zod zapewniający bezpieczeństwo w czasie działania
- Własne reguły walidacji dla modeli i endpointów

### 5. Wieloplatformowe Wsparcie
- Express, Fastify, Koa jako wspierane frameworki
- Wspólny model definicji niezależny od platformy
- Łatwa migracja między platformami

### 6. Generowanie UI
- Automatyczne tworzenie schematów UI z definicji
- Kompatybilność z popularnymi bibliotekami frontend
- Deklaratywna konfiguracja layoutów i komponentów

## 🛠️ Narzędzia Deweloperskie

### CLI
```bash
# Inicjalizacja nowego projektu
npx tokendsl init my-api

# Generowanie kodu z definicji DSL
npx tokendsl generate definitions/users-api.dsl.ts

# Tworzenie nowego endpointu
npx tokendsl create users/create --method POST

# Generowanie dokumentacji
npx tokendsl docs generate

# Generowanie kodu frontend
npx tokendsl frontend generate --framework react
```

### Walidator DSL
- Sprawdzanie poprawności składni
- Walidacja typów i schematów
- Weryfikacja zależności między serwisami
- Sprawdzanie poprawności tłumaczeń

## 📚 Dokumentacja

### Struktura Dokumentacji
```
docs/
├── guide/                  # Przewodnik użytkownika
│   ├── getting-started.md  # Wprowadzenie
│   ├── dsl-syntax.md       # Składnia DSL
│   ├── typescript-api.md   # API TypeScript
│   └── ui-schema.md        # Schematy UI
├── api/                    # Dokumentacja API
└── examples/               # Przykłady użycia
```

## 🎨 Przykład Użycia

### Definicja Serwisu
```typescript
import { defineService } from '@tokendsl/core';
import * as userEndpoints from './endpoints/users.endpoints.dsl';
import { serviceConfig } from './service.config.dsl';

export const userService = defineService({
  name: 'users',
  version: '1.0',
  config: serviceConfig,
  endpoints: userEndpoints,
  models: {
    User: {
      fields: {
        id: 'string',
        name: 'string',
        email: 'string',
        role: 'enum(admin,user)'
      }
    }
  }
});
```

### Definicja Endpointu
```typescript
import { z } from 'zod';
import { defineEndpoint } from '@tokendsl/core';

const UserInputSchema = z.object({
  name: z.string().describe('Full name of the user'),
  email: z.string().email().describe('Email used for login'),
});

export const createUserEndpoint = defineEndpoint({
  method: 'POST',
  path: '/users',
  input: UserInputSchema,
  handler: async (input) => {
    // Logika tworzenia użytkownika
  },
  uiSchema: {
    layout: 'form',
    fields: {
      name: { type: 'text', label: 'Full name' },
      email: { type: 'email', label: 'Email address' }
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

## 🔚 Podsumowanie
TokenDSL to innowacyjny system do tworzenia API, który łączy w sobie:
- Efektywność tokenową dla modeli AI
- Bezpieczeństwo typów TypeScript
- Deklaratywność DSL
- Automatyczne generowanie UI
- Wsparcie dla wielu platform
- Zaawansowane funkcje jak wersjonowanie i i18n

Projekt jest szczególnie przydatny dla zespołów korzystających z modeli językowych do generowania kodu, ponieważ struktura DSL jest optymalizowana pod kątem efektywności tokenowej i jednoznaczności. 


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



----

Podsumowanie TokenDSL - wizja projektu:

TokenDSL to kompleksowy system do definiowania, walidowania i wdrażania API w sposób efektywny pod względem tokenów i przyjazny dla modeli AI. Projekt integruje wiele zaawansowanych koncepcji:

1.  **Warstwowa architektura**:
    *   Warstwa definicji DSL (pliki .dsl.ts)
    *   Warstwa przetwarzania (loader, walidator, generator)
    *   Warstwa wdrożeń API (generowane serwery)
    *   Warstwa klientów (frontend, dokumentacja)
2.  **Wersjonowanie API**:
    *   Struktura katalogów oparta na nazwach serwisów i wersjach
    *   Wsparcie dla wielu wersji tego samego API działających równolegle
3.  **Internacjonalizacja (i18n)**:
    *   Pliki tłumaczeń w formacie .mo dla każdego serwisu
    *   Wsparcie dla wielu języków w komunikatach i dokumentacji
4.  **Dane testowe**:
    *   Wbudowane dane demonstracyjne dla każdego modelu
    *   Możliwość automatycznego zasilania środowiska deweloperskiego
5.  **Walidacja**:
    *   Automatyczna walidacja plików DSL
    *   System typów oparty na Zod zapewniający bezpieczeństwo w czasie działania
6.  **Wieloplatformowe wsparcie**:
    *   Express, Fastify, Koa jako wspierane frameworki
    *   Wspólny model definicji niezależny od platformy
7.  **Generowanie UI**:
    *   Automatyczne tworzenie schematów UI z definicji
    *   Kompatybilność z popularnymi bibliotekami frontend

Główna wartość TokenDSL to minimalizacja ilości kodu przy jednoczesnym zachowaniu pełnej kontroli nad API. Projekt jest szczególnie użyteczny dla zespołów korzystających z modeli językowych do generowania kodu, ponieważ struktura DSL jest optymalizowana pod kątem efektywności tokenowej i jednoznaczności.

TokenDSL może działać jako "fabryka mikroserwisów", gdzie każda wersja każdego serwisu może być niezależnie rozwijana, testowana i wdrażana, wszystko w oparciu o jednolity model definicji.

Rozumiem, chcesz zobaczyć diagram architektury w formacie Mermaid, który można osadzić w dokumentacji MDX. Oto diagram przedstawiający wizję projektu TokenDSL:TokenDSL - Architektura - Diagram MermaidClick to open diagramTap to openDla jeszcze lepszego zrozumienia architektury, oto drugi diagram Mermaid przedstawiający przepływ danych w TokenDSL:TokenDSL - Przepływ danychClick to open diagramTap to openOstatni diagram, który przedstawia hierarchię klas i relacje między komponentami TokenDSL:TokenDSL - Diagram klas i komponentówClick to open diagramTap to openTe trzy diagramy Mermaid dają pełny obraz architektury TokenDSL:

Diagram architektury - przedstawia ogólną strukturę systemu, od definicji DSL, przez warstwy przetwarzania, aż po wygenerowane API i klientów.
Diagram przepływu danych - pokazuje, jak informacje przepływają przez system, począwszy od plików źródłowych, przez etapy przetwarzania, aż po wygenerowany kod i wdrożone usługi.
Diagram klas - prezentuje relacje między głównymi klasami i komponentami systemu, co jest przydatne dla osób implementujących rozwiązanie.

Te diagramy można osadzić w dokumentacji MDX, co ułatwi zrozumienie projektu zarówno dla deweloperów, jak i dla modeli językowych, które mogą pomóc w jego rozwijaniu. TokenDSL jako rozwiązanie zapewnia spójny, dobrze ustrukturyzowany sposób definiowania API, który jest jednocześnie wydajny pod względem tokenów i bogaty w funkcje.


---

Aby rozwinąć TokenDSL i upewnić się, że nie brakuje niczego istotnego, proponuję następujące dodatki:

1.  **Struktura projektu/plików**:

Copy

`/ ├── src/ │   ├── dsl/ │   │   ├── engine.ts             # Silnik DSL │   │   ├── types.ts              # Typy bazowe │   │   └── utils.ts              # Narzędzia pomocnicze │   ├── schemas/                  # Współdzielone schematy │   ├── api/ │   │   ├── users.dsl.ts │   │   ├── auth.dsl.ts │   │   └── ... │   ├── handlers/                 # Implementacje endpointów │   │   ├── users.ts │   │   └── auth.ts │   ├── middlewares/              # Middleware │   │   └── auth.middleware.ts │   └── index.ts                  # Główny plik ├── scripts/ │   ├── generate-types.ts         # Generator typów dla frontendu │   └── generate-docs.ts          # Generator dokumentacji └── config/
 └── dsl.config.ts             # Konfiguracja DSL`

2.  **Rozszerzenie DSL o middleware**:

ts

Copy

`'GET /users/:id': {  middleware: [authMiddleware, logMiddleware], input: z.object({ id: z.string() }), handler: getUserById, // ... }`

3.  **Walidacja odpowiedzi**:

ts

Copy

`'GET /users/:id': {  input: z.object({ id: z.string() }), output: z.object({ id: z.string(), name: z.string(), email: z.string().email(), }), handler: getUserById, }`

4.  **Rozszerzenie metadanych o status HTTP**:

ts

Copy

`'GET /users/:id': {  // ... statusCodes: { 200: 'Success', 404: 'User not found', 500: 'Internal server error', }, }`

5.  **Rozszerzona konfiguracja UI**:

ts

Copy

`uiSchema: {  layout: 'form', formOptions: { submitText: 'Create User', cancelText: 'Cancel', fullWidth: true, }, fields: { name: { type: 'text', label: 'Full name', required: true, helperText: 'Enter your full legal name', validationRules: { minLength: 2, maxLength: 50, } }, // ... }, }`

6.  **Rozszerzona dokumentacja**:

ts

Copy

`'POST /users': {  // ... docs: { summary: 'Create a new user', description: 'Creates a new user in the system', requestExample: { name: 'Alice', email: 'alice@example.com' }, responseExample: { id: '123', name: 'Alice', email: 'alice@example.com' }, errors: [ { status: 400, description: 'Invalid input' }, { status: 409, description: 'Email already exists' }, ], }, }`

7.  **Zarządzanie wersjami API**:

ts

Copy

`export const userApiV1 = defineApi({  version: 'v1', prefix: '/api/v1', endpoints: { 'GET /users/:id': { /* ... */ }, } });`

8.  **Konfiguracja testowa**:

ts

Copy

`'POST /users': {  // ... tests: { validInputs: [ { input: { name: 'Alice', email: 'alice@example.com' }, expected: { success: true } }, ], invalidInputs: [ { input: { name: '', email: 'invalid' }, expected: { error: true } }, ], }, }`

9.  **Definicja zależności**:

ts

Copy

`'GET /users/:id/orders': {  dependencies: ['GET /users/:id', 'GET /orders/:id'], // ... }`

10.  **Definicja CLI**:

Copy

`# Generowanie endpointu npx tokendsl generate endpoint users/create --method POST  # Generowanie interfejsu UI npx tokendsl generate ui users/create --framework react  # Generowanie dokumentacji npx tokendsl generate docs`

Te rozszerzenia dodają więcej wartości do TokenDSL, zachowując jego efektywność tokenową i czytelność, a jednocześnie dodając funkcje, które mogą być przydatne dla większych projektów. Główną ideą jest utrzymanie jednego źródła prawdy dla każdego endpointu, jednocześnie umożliwiając generowanie różnych artefaktów (typów, dokumentacji, testów, UI) z tej samej definicji.

----

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


----

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


----

super, czuy taki dsl bedzie jednozczaczy? ew czy mozna  npisac struktue xml ktora pozwoli jednoznaczne naszej blbioekce wygenrowac z niej taki backend w locie?Rozumiem, że pytasz o jednoznaczność DSL i możliwość reprezentacji w XML, która pozwoliłaby na automatyczne generowanie backendu.
TokenDSL w obecnej formie jest już dość jednoznaczny dzięki silnemu typowaniu TypeScript i Zod. Jednak faktycznie można go jeszcze bardziej ustrukturyzować poprzez format XML, który byłby łatwiej przetwarzany przez narzędzia zewnętrzne i bardziej jednoznaczny dla różnych systemów.
Oto propozycja struktury XML dla TokenDSL:



---


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

----



---

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
    <endpoint method="POST" path="/users">
      <description>Create a new user</description>
      <tags>
        <tag>users</tag>
        <tag>create</tag>
      </tags>
      <input>
        <schema>
          <object>
            <property name="name" type="string" description="Full name of the user" />
            <property name="email" type="string" format="email" description="Email used for login" />
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
      <handler file="handlers/users.ts" function="createUser" />
      <examples>
        <example type="input">
          <value><![CDATA[{ "name": "Alice", "email": "alice@example.com" }]]></value>
        </example>
      </examples>
      <uiSchema>
        <layout>form</layout>
        <formOptions>
          <submitText>Create User</submitText>
          <cancelText>Cancel</cancelText>
        </formOptions>
        <fields>
          <field name="name">
            <type>text</type>
            <label>Full name</label>
            <required>true</required>
            <helperText>Enter your full legal name</helperText>
            <validationRules>
              <minLength>2</minLength>
              <maxLength>50</maxLength>
            </validationRules>
          </field>
          <field name="email">
            <type>email</type>
            <label>Email address</label>
            <required>true</required>
          </field>
        </fields>
      </uiSchema>
      <tests>
        <test>
          <input><![CDATA[{ "name": "Alice", "email": "alice@example.com" }]]></input>
          <expected><![CDATA[{ "success": true }]]></expected>
        </test>
        <test>
          <input><![CDATA[{ "name": "", "email": "invalid" }]]></input>
          <expected><![CDATA[{ "error": true }]]></expected>
        </test>
      </tests>
      <commitHint>Add user creation endpoint</commitHint>
    </endpoint>
  </api>
</tokenDSL>


Taka struktura XML jest bardziej jednoznaczna i pozwala na automatyczne generowanie backendu. Aby zaimplementować bibliotekę, która może generować backend w locie z takiego XML, proponuję następujący schemat:

import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { Express } from 'express';
import * as z from 'zod';

interface TokenDslConfig {
  outputDir: string;
  templateDir: string;
  handlerDir: string;
  middlewareDir: string;
}

class TokenDslGenerator {
  private config: TokenDslConfig;
  private parser: XMLParser;

  constructor(config: TokenDslConfig) {
    this.config = config;
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '_',
      isArray: (name) => ['tag', 'property', 'code', 'example', 'field', 'test', 'apply'].includes(name),
    });
  }
  
  // Parsowanie pliku XML do struktury JS
  parseXmlFile(filePath: string) {
    const xmlContent = fs.readFileSync(filePath, 'utf-8');
    return this.parser.parse(xmlContent);
  }
  
  // Generowanie schematu Zod z definicji XML
  generateZodSchema(schemaDefinition: any): string {
    if (schemaDefinition.object) {
      const properties = schemaDefinition.object.property;
      const lines = properties.map((prop: any) => {
        let propCode = `${prop._name}: z.${prop._type}()`;
        
        if (prop._format === 'email') {
          propCode = `${prop._name}: z.string().email()`;
        }
        
        if (prop._description) {
          propCode += `.describe('${prop._description}')`;
        }
        
        return propCode;
      });
      
      return `z.object({\n  ${lines.join(',\n  ')}\n})`;
    }
    
    return 'z.any()';
  }
  
  // Generowanie importów handlerów
  generateHandlerImports(endpoints: any[]): string {
    const handlerFiles = new Set<string>();
    const handlers = new Set<string>();
    
    endpoints.forEach(endpoint => {
      const handlerFile = endpoint.handler._file;
      const handlerFunc = endpoint.handler._function;
      handlerFiles.add(handlerFile);
      handlers.add(handlerFunc);
    });
    
    return Array.from(handlerFiles).map(file => {
      const importedHandlers = Array.from(handlers).join(', ');
      return `import { ${importedHandlers} } from '../${file}';`;
    }).join('\n');
  }
  
  // Generowanie kodu dla endpointu
  generateEndpointCode(endpoint: any): string {
    const method = endpoint._method;
    const path = endpoint._path;
    const handlerFunc = endpoint.handler._function;
    
    const inputSchema = endpoint.input ? 
      this.generateZodSchema(endpoint.input.schema) : 
      'z.object({})';
    
    const outputSchema = endpoint.o ? 
      this.generateZodSchema(endpoint.o.schema) : 
      null;
    
    const tagsArray = endpoint.tags && endpoint.tags.tag ? 
      `[${endpoint.tags.tag.map((t: any) => `'${t}'`).join(', ')}]` : 
      '[]';
    
    let uiSchemaCode = 'undefined';
    if (endpoint.uiSchema) {
      const fields = endpoint.uiSchema.fields.field.map((field: any) => {
        return `${field._name}: { 
          type: '${field.type}', 
          label: '${field.label}'${field.display ? `, display: '${field.display}'` : ''}${field.required ? `, required: ${field.required}` : ''}${field.helperText ? `, helperText: '${field.helperText}'` : ''}
        }`;
      }).join(',\n        ');
      
      uiSchemaCode = `{
      layout: '${endpoint.uiSchema.layout}',
      ${endpoint.uiSchema.formOptions ? `formOptions: {
        submitText: '${endpoint.uiSchema.formOptions.submitText || 'Submit'}',
        cancelText: '${endpoint.uiSchema.formOptions.cancelText || 'Cancel'}'
      },` : ''}
      fields: {
        ${fields}
      }
    }`;
    }
    
    let exampleCode = '';
    if (endpoint.examples && endpoint.examples.example) {
      const examples = endpoint.examples.example.map((ex: any) => {
        return `${ex._type}Example: ${ex.value}`;
      }).join(',\n    ');
      
      if (examples) {
        exampleCode = `,\n    ${examples}`;
      }
    }
    
    return `  '${method} ${path}': {
    input: ${inputSchema},
    ${outputSchema ? `output: ${outputSchema},` : ''}
    handler: ${handlerFunc},
    description: '${endpoint.description || ''}',
    tags: ${tagsArray},
    ${endpoint.middleware ? `middleware: [${endpoint.middleware.apply.map((m: any) => m).join(', ')}],` : ''}
    ${endpoint.statusCodes ? `statusCodes: {
      ${endpoint.statusCodes.code.map((c: any) => `${c._value}: '${c}'`).join(',\n      ')}
    },` : ''}
    uiSchema: ${uiSchemaCode}${exampleCode}
    ${endpoint.commitHint ? `,\n    commitHint: '${endpoint.commitHint}'` : ''}
  }`;
  }
  
  // Generowanie kodu całego API z XML
  generateApiFromXml(xmlData: any): string {
    const api = xmlData.tokenDSL.api;
    const apiName = api._name;
    const endpoints = Array.isArray(api.endpoint) ? api.endpoint : [api.endpoint];
    
    const importsCode = this.generateHandlerImports(endpoints);
    const endpointsCode = endpoints.map(endpoint => this.generateEndpointCode(endpoint)).join(',\n\n');
    
    return `import { z } from 'zod';
import { defineApi } from '../dsl/engine';
${importsCode}

export const ${apiName} = defineApi({
  ${api._prefix ? `prefix: '${api._prefix}',` : ''}
${endpointsCode}
});
`;
  }
  
  // Generowanie backendu Express z definicji API
  generateExpressBackend(apiCode: string): string {
    return `import express from 'express';
import bodyParser from 'body-parser';
import { applyApi } from './dsl/engine';
${apiCode.split('export ')[0]}

const app = express();
app.use(bodyParser.json());

// Apply API definitions
const ${apiCode.match(/export const (\w+)/)?.[1]} = ${apiCode.split('export const ')[1]};
applyApi(app, ${apiCode.match(/export const (\w+)/)?.[1]});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
  }
  
  // Generowanie silnika DSL
  generateDslEngine(): string {
    return `import { z } from 'zod';
import { Express, Request, Response } from 'express';

export type Handler<T = any, R = any> = (data: T, req: Request) => Promise<R> | R;

export interface EndpointDefinition<T = any, R = any> {
  input?: z.ZodType<T>;
  output?: z.ZodType<R>;
  handler: Handler<T, R>;
  description?: string;
  tags?: string[];
  middleware?: Array<(req: Request, res: Response, next: Function) => void>;
  statusCodes?: Record<number, string>;
  uiSchema?: UISchema;
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

export type ApiDefinition = Record<string, EndpointDefinition>;

export function defineApi(definition: ApiDefinition): ApiDefinition {
  return definition;
}

export function applyApi(app: Express, api: ApiDefinition): void {
  for (const [routeKey, def] of Object.entries(api)) {
    const [method, path] = routeKey.split(' ');
    const handler = def.handler;
    const inputSchema = def.input;
    const outputSchema = def.output;
    const middleware = def.middleware || [];
    
    app[method.toLowerCase()](path, ...middleware, async (req: Request, res: Response) => {
      try {
        // Combine parameters from different sources
        const rawData = {
          ...req.params,
          


          -----

#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { TokenDslGenerator } from '../lib/generator';

const program = new Command();

program
  .name('tokendsl')
  .description('CLI for TokenDSL - Token-Efficient Backend DSL')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate code from TokenDSL XML definition')
  .argument('<file>', 'XML file containing TokenDSL definition')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .option('-f, --framework <framework>', 'Backend framework (express, fastify)', 'express')
  .action(async (file, options) => {
    try {
      const generator = new TokenDslGenerator({
        outputDir: options.output,
        templateDir: path.join(__dirname, '../templates'),
        handlerDir: 'handlers',
        middlewareDir: 'middlewares'
      });
      
      console.log(chalk.blue(`Parsing ${file}...`));
      const xmlData = generator.parseXmlFile(file);
      
      console.log(chalk.blue('Generating API code...'));
      const apiCode = generator.generateApiFromXml(xmlData);
      
      // Create output directory if it doesn't exist
      if (!fs.existsSync(options.output)) {
        fs.mkdirSync(options.output, { recursive: true });
      }
      
      // Write API file
      const apiFileName = path.basename(file, '.xml') + '.ts';
      fs.writeFileSync(path.join(options.output, apiFileName), apiCode);
      console.log(chalk.green(`✓ API file generated: ${apiFileName}`));
      
      // Generate and write DSL engine
      const dslDir = path.join(options.output, 'dsl');
      if (!fs.existsSync(dslDir)) {
        fs.mkdirSync(dslDir, { recursive: true });
      }
      
      const engineCode = generator.generateDslEngine();
      fs.writeFileSync(path.join(dslDir, 'engine.ts'), engineCode);
      console.log(chalk.green('✓ DSL engine generated'));
      
      // Generate backend if requested
      if (options.framework) {
        console.log(chalk.blue(`Generating ${options.framework} backend...`));
        const backendCode = generator.generateExpressBackend(apiCode);
        fs.writeFileSync(path.join(options.output, 'index.ts'), backendCode);
        console.log(chalk.green('✓ Backend application generated'));
      }
      
      console.log(chalk.green('\nAll files generated successfully!'));
    } catch (error) {
      console.error(chalk.red('Error generating code:'), error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new TokenDSL project')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'tokendsl-project'
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Choose a backend framework:',
        choices: ['express', 'fastify'],
        default: 'express'
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Use TypeScript?',
        default: true
      },
      {
        type: 'confirm',
        name: 'generateExample',
        message: 'Generate example API?',
        default: true
      }
    ]);
    
    const projectDir = answers.projectName;
    
    // Create project directory
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    
    // Create package.json
    const packageJson = {
      name: answers.projectName,
      version: '0.1.0',
      description: 'API built with TokenDSL',
      main: 'dist/index.js',
      scripts: {
        start: answers.typescript ? 'ts-node src/index.ts' : 'node src/index.js',
        build: answers.typescript ? 'tsc' : 'echo "No build step"',
        dev: answers.typescript ? 'nodemon --exec ts-node src/index.ts' : 'nodemon src/index.js',
        generate: 'tokendsl generate'
      },
      dependencies: {
        [answers.framework]: '^latest',
        'zod': '^latest',
        'fast-xml-parser': '^latest'
      },
      devDependencies: answers.typescript ? {
        'typescript': '^latest',
        'ts-node': '^latest',
        'nodemon': '^latest',
        '@types/node': '^latest',
        [`@types/${answers.framework}`]: '^latest'
      } : {
        'nodemon': '^latest'
      }
    };
    
    fs.writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create project structure
    const srcDir = path.join(projectDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'dsl'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'api'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'handlers'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'middlewares'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'definitions'), { recursive: true });
    
    // Create example files if requested
    if (answers.generateExample) {
      // Create example XML
      const exampleXml = fs.readFileSync(
        path.join(__dirname, '../templates/example.xml'),
        'utf-8'
      );
      fs.writeFileSync(
        path.join(projectDir, 'definitions', 'example.xml'),
        exampleXml
      );
      
      // Create example handler
      const extension = answers.typescript ? 'ts' : 'js';
      const exampleHandler = fs.readFileSync(
        path.join(__dirname, `../templates/example-handler.${extension}`),
        'utf-8'
      );
      fs.writeFileSync(
        path.join(srcDir, 'handlers', `users.${extension}`),
        exampleHandler
      );
    }
    
    // Create README.md
    const readme = `# ${answers.projectName}

API built with TokenDSL - A token-efficient backend DSL for AI-integrated development.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate code from XML definition
npm run generate -- definitions/example.xml
\`\`\`
`;
    fs.writeFileSync(path.join(projectDir, 'README.md'), readme);
    
    // Create tsconfig.json if TypeScript is selected
    if (answers.typescript) {
      const tsConfig = {
        compilerOptions: {
          target: 'es2020',
          module: 'commonjs',
          esModuleInterop: true,
          outDir: './dist',
          strict: true,
          rootDir: './src'
        },
        include: ['src/**/*'],
        exclude: ['node_modules']
      };
      fs.writeFileSync(
        path.join(projectDir, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, 2)
      );
    }
    
    console.log(chalk.green(`\nProject ${answers.projectName} initialized successfully!`));
    console.log(`
Run the following commands to get started:

  ${chalk.cyan(`cd ${answers.projectName}`)}
  ${chalk.cyan('npm install')}
  ${chalk.cyan('npm run dev')}
    `);
  });

program
  .command('create')
  .description('Create a new TokenDSL API endpoint')
  .argument('<name>', 'Endpoint name (e.g., users/create)')
  .option('-m, --method <method>', 'HTTP method', 'GET')
  .option('-p, --path <path>', 'Endpoint path')
  .action(async (name, options) => {
    const [resource, action] = name.split('/');
    const path = options.path || `/${resource}${action ? `/${action}` : ''}`;
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Endpoint description:',
        default: `${options.method} ${path} endpoint`
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags (comma separated):',
        default: resource
      },
      {
        type: 'confirm',
        name: 'uiSchema',
        message: 'Generate UI schema?',
        default: true
      }
    ]);
    
    // Create XML template
    const xmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<tokenDSL version="1.0">
  <api name="${resource}Api">
    <endpoint method="${options.method}" path="${path}">
      <description>${answers.description}</description>
      <tags>
        ${answers.tags.split(',').map(tag => `<tag>${tag.trim()}</tag>`).join('\n        ')}
      </tags>
      <input>
        <schema>
          <object>
            <!-- Define input properties here -->
            <property name="example" type="string" description="Example property" />
          </object>
        </schema>
      </input>
      <handler file="handlers/${resource}.ts" function="${action || 'getAll'}${resource.charAt(0).toUpperCase() + resource.slice(1)}" />
      ${answers.uiSchema ? `<uiSchema>
        <layout>${action === 'create' || action === 'update' ? 'form' : 'card'}</layout>
        <fields>
          <field name="example">
            <type>text</type>
            <label>Example field</label>
          </field>
        </fields>
      </uiSchema>` : ''}
      <commitHint>Add ${resource} ${action} endpoint</commitHint>
    </endpoint>
  </api>
</tokenDSL>`;

    const definitionsDir = './definitions';
    if (!fs.existsSync(definitionsDir)) {
      fs.mkdirSync(definitionsDir, { recursive: true });
    }
    
    const fileName = `${resource}-${action || 'main'}.xml`;
    fs.writeFileSync(path.join(definitionsDir, fileName), xmlTemplate);
    
    console.log(chalk.green(`\nEndpoint definition created: ${fileName}`));
    console.log(`
To generate code from this definition, run:

  ${chalk.cyan(`tokendsl generate ${path.join(definitionsDir, fileName)}`)}
    `);
  });

program.parse();


====


# Struktura projektu TokenDSL

```
tokendsl/
├── package.json                # Definicja pakietu npm
├── tsconfig.json               # Konfiguracja TypeScript
├── README.md                   # Dokumentacja projektu
├── src/                        # Kod źródłowy biblioteki
│   ├── index.ts                # Główny punkt wejścia
│   ├── cli.ts                  # Kod interfejsu wiersza poleceń
│   ├── generator/              # Generator kodu
│   │   ├── index.ts            # Eksport generatora
│   │   ├── xml-parser.ts       # Parser definicji XML
│   │   ├── typescript-gen.ts   # Generator kodu TypeScript
│   │   ├── zod-gen.ts          # Generator schematów Zod
│   │   ├── express-gen.ts      # Generator backendu Express
│   │   ├── fastify-gen.ts      # Generator backendu Fastify
│   │   └── ui-gen.ts           # Generator komponentów UI
│   ├── dsl/                    # Silnik DSL
│   │   ├── engine.ts           # Główny silnik DSL
│   │   ├── types.ts            # Definicje typów
│   │   ├── validators.ts       # Walidatory
│   │   └── utils.ts            # Narzędzia pomocnicze
│   ├── transforms/             # Transformatory dla różnych formatów
│   │   ├── openapi.ts          # Konwersja na OpenAPI
│   │   ├── postman.ts          # Konwersja na kolekcję Postman
│   │   └── typescript.ts       # Konwersja na typy TypeScript
│   └── templates/              # Szablony generowanych plików
│       ├── express/            # Szablony dla Express
│       ├── fastify/            # Szablony dla Fastify
│       ├── react/              # Szablony dla React
│       └── vue/                # Szablony dla Vue
├── bin/                        # Skrypty wykonywalne
│   └── tokendsl.js             # Plik wykonywalny CLI
├── templates/                  # Szablony dla inicjalizacji projektu
│   ├── example.xml             # Przykładowa definicja API
│   ├── example-handler.ts      # Przykładowy handler
│   └── project-structure/      # Szablony struktury projektu
├── examples/                   # Przykładowe projekty
│   ├── basic-api/              # Podstawowe API
│   ├── full-stack/             # Pełny stack z frontendem
│   └── microservices/          # Architektura mikroserwisowa
└── docs/                       # Dokumentacja
    ├── guide/                  # Przewodnik użytkownika
    │   ├── getting-started.md  # Wprowadzenie
    │   ├── xml-syntax.md       # Składnia XML
    │   ├── typescript-api.md   # API TypeScript
    │   └── ui-schema.md        # Schematy UI
    ├── api/                    # Dokumentacja API
    │   ├── engine.md           # Dokumentacja silnika DSL
    │   ├── generator.md        # Dokumentacja generatora
    │   └── cli.md              # Dokumentacja CLI
    └── examples/               # Przykłady użycia
        ├── basic.md            # Podstawowe przykłady
        ├── advanced.md         # Zaawansowane przykłady
        └── real-world.md       # Przykłady z prawdziwego świata
```

## Struktura XMLowego DSL

Schemat XML dla TokenDSL składa się z następujących głównych elementów:

```xml
<tokenDSL version="1.0">
  <api name="apiName" prefix="/api/prefix">
    <endpoint method="HTTP_METHOD" path="/path/:param">
      <!-- Definicja endpointu -->
    </endpoint>
    <!-- Więcej endpointów -->
  </api>
  <!-- Więcej API -->
</tokenDSL>
```

Każdy endpoint może zawierać:

```xml
<endpoint method="GET" path="/users/:id">
  <description>Opis endpointu</description>
  <tags>
    <tag>tag1</tag>
    <tag>tag2</tag>
  </tags>
  <input>
    <schema>
      <!-- Definicja schematu wejściowego -->
    </schema>
  </input>
  <output>
    <schema>
      <!-- Definicja schematu wyjściowego -->
    </schema>
  </output>
  <handler file="path/to/handler" function="handlerFunction" />
  <middleware>
    <apply>middlewareFunction1</apply>
    <apply>middlewareFunction2</apply>
  </middleware>
  <statusCodes>
    <code value="200">Sukces</code>
    <code value="404">Nie znaleziono</code>
  </statusCodes>
  <uiSchema>
    <!-- Definicja UI -->
  </uiSchema>
  <examples>
    <!-- Przykłady -->
  </examples>
  <tests>
    <!-- Testy -->
  </tests>
  <commitHint>Podpowiedź dla commita</commitHint>
</endpoint>
```

## Struktura typów TypeScript

```typescript
// Główne typy DSL
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

## CLI - przykłady użycia

```bash
# Inicjalizacja nowego projektu
npx tokendsl init my-api

# Generowanie kodu z definicji XML
npx tokendsl generate definitions/users-api.xml

# Tworzenie nowego endpointu
npx tokendsl create users/create --method POST

# Generowanie dokumentacji
npx tokendsl docs generate

# Generowanie kodu frontend
npx tokendsl frontend generate --framework react
```

-----


# Struktura projektu TokenDSL

```
tokendsl/
├── package.json                # Definicja pakietu npm
├── tsconfig.json               # Konfiguracja TypeScript
├── README.md                   # Dokumentacja projektu
├── src/                        # Kod źródłowy biblioteki
│   ├── index.ts                # Główny punkt wejścia
│   ├── cli.ts                  # Kod interfejsu wiersza poleceń
│   ├── generator/              # Generator kodu
│   │   ├── index.ts            # Eksport generatora
│   │   ├── xml-parser.ts       # Parser definicji XML
│   │   ├── typescript-gen.ts   # Generator kodu TypeScript
│   │   ├── zod-gen.ts          # Generator schematów Zod
│   │   ├── express-gen.ts      # Generator backendu Express
│   │   ├── fastify-gen.ts      # Generator backendu Fastify
│   │   └── ui-gen.ts           # Generator komponentów UI
│   ├── dsl/                    # Silnik DSL
│   │   ├── engine.ts           # Główny silnik DSL
│   │   ├── types.ts            # Definicje typów
│   │   ├── validators.ts       # Walidatory
│   │   └── utils.ts            # Narzędzia pomocnicze
│   ├── transforms/             # Transformatory dla różnych formatów
│   │   ├── openapi.ts          # Konwersja na OpenAPI
│   │   ├── postman.ts          # Konwersja na kolekcję Postman
│   │   └── typescript.ts       # Konwersja na typy TypeScript
│   └── templates/              # Szablony generowanych plików
│       ├── express/            # Szablony dla Express
│       ├── fastify/            # Szablony dla Fastify
│       ├── react/              # Szablony dla React
│       └── vue/                # Szablony dla Vue
├── bin/                        # Skrypty wykonywalne
│   └── tokendsl.js             # Plik wykonywalny CLI
├── templates/                  # Szablony dla inicjalizacji projektu
│   ├── example.xml             # Przykładowa definicja API
│   ├── example-handler.ts      # Przykładowy handler
│   └── project-structure/      # Szablony struktury projektu
├── examples/                   # Przykładowe projekty
│   ├── basic-api/              # Podstawowe API
│   ├── full-stack/             # Pełny stack z frontendem
│   └── microservices/          # Architektura mikroserwisowa
└── docs/                       # Dokumentacja
    ├── guide/                  # Przewodnik użytkownika
    │   ├── getting-started.md  # Wprowadzenie
    │   ├── xml-syntax.md       # Składnia XML
    │   ├── typescript-api.md   # API TypeScript
    │   └── ui-schema.md        # Schematy UI
    ├── api/                    # Dokumentacja API
    │   ├── engine.md           # Dokumentacja silnika DSL
    │   ├── generator.md        # Dokumentacja generatora
    │   └── cli.md              # Dokumentacja CLI
    └── examples/               # Przykłady użycia
        ├── basic.md            # Podstawowe przykłady
        ├── advanced.md         # Zaawansowane przykłady
        └── real-world.md       # Przykłady z prawdziwego świata
```

## Struktura XMLowego DSL

Schemat XML dla TokenDSL składa się z następujących głównych elementów:

```xml
<tokenDSL version="1.0">
  <api name="apiName" prefix="/api/prefix">
    <endpoint method="HTTP_METHOD" path="/path/:param">
      <!-- Definicja endpointu -->
    </endpoint>
    <!-- Więcej endpointów -->
  </api>
  <!-- Więcej API -->
</tokenDSL>
```

Każdy endpoint może zawierać:

```xml
<endpoint method="GET" path="/users/:id">
  <description>Opis endpointu</description>
  <tags>
    <tag>tag1</tag>
    <tag>tag2</tag>
  </tags>
  <input>
    <schema>
      <!-- Definicja schematu wejściowego -->
    </schema>
  </input>
  <output>
    <schema>
      <!-- Definicja schematu wyjściowego -->
    </schema>
  </output>
  <handler file="path/to/handler" function="handlerFunction" />
  <middleware>
    <apply>middlewareFunction1</apply>
    <apply>middlewareFunction2</apply>
  </middleware>
  <statusCodes>
    <code value="200">Sukces</code>
    <code value="404">Nie znaleziono</code>
  </statusCodes>
  <uiSchema>
    <!-- Definicja UI -->
  </uiSchema>
  <examples>
    <!-- Przykłady -->
  </examples>
  <tests>
    <!-- Testy -->
  </tests>
  <commitHint>Podpowiedź dla commita</commitHint>
</endpoint>
```

## Struktura typów TypeScript

```typescript
// Główne typy DSL
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

## CLI - przykłady użycia

```bash
# Inicjalizacja nowego projektu
npx tokendsl init my-api

# Generowanie kodu z definicji XML
npx tokendsl generate definitions/users-api.xml

# Tworzenie nowego endpointu
npx tokendsl create users/create --method POST

# Generowanie dokumentacji
npx tokendsl docs generate

# Generowanie kodu frontend
npx tokendsl frontend generate --framework react
```

----


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


    ------
    