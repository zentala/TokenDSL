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

export default defineService({
  name: 'users-service',
  version: '1.0',
  config: serviceConfig,
  endpoints: userEndpoints
});
```

### Definicja Modelu
```typescript
import { defineModel, z } from '@tokendsl/core';

export const UserModel = defineModel({
  name: 'User',
  schema: z.object({
    id: z.string().uuid(),
    username: z.string().min(3),
    email: z.string().email()
  }),
  relations: {
    hasMany: {
      orders: 'Order'
    }
  }
});
```

### Definicja Endpointu
```typescript
import { defineEndpoints } from '@tokendsl/core';
import { UserModel } from '../models/user.model.dsl';

export default defineEndpoints({
  'GET /users': {
    description: 'Get all users',
    tags: ['users'],
    version: '1.0',
    input: z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10)
    }),
    output: z.object({
      users: z.array(UserModel.schema),
      total: z.number()
    }),
    handler: 'handlers/users/getUsers'
  }
});
```

## 🚀 Rozwój Projektu

### Planowane Funkcje
- Auto-generowanie OpenAPI docs
- CLI do scaffoldowania routów i schematów
- Generowanie formularzy frontend z schematów
- Integracja z middleware autoryzacji
- Plugin VS Code dla autouzupełniania i podglądu
- Standardowe pola metadanych dla LLM
- Deklaratywne theming/layouty frontend

### Status
🚧 Projekt w fazie wczesnego rozwoju 