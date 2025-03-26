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