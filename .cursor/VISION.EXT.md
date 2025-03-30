Jasne, oto rozszerzona wizja projektu TokenDSL, która explicite implementuje strategie mające na celu zarządzanie złożonością DSL, zgodnie z naszą dyskusją:

---

# TokenDSL: Token-Efficient Backend DSL for AI-Integrated Development (Wersja Rozszerzona)

## 🎯 Project Overview (Zaktualizowane)

TokenDSL to kompleksowy system do definiowania, walidowania i wdrażania API w sposób **efektywny tokenowo** i przyjazny dla modeli AI. Projekt integruje zaawansowane koncepcje, kładąc **nacisk na prostotę dla typowych przypadków użycia**, jednocześnie oferując **pełną moc dla zaawansowanych scenariuszy** poprzez **warstwowe ujawnianie złożoności**. Kluczowe cele:

-   ✍️ **Minimalizacja boilerplate'u** przez deklaratywny DSL i generowanie kodu.
-   ✅ **Automatyczna walidacja** i **wnioskowanie typów** (oparte na Zod i TypeScript).
-   🔄 **Współdzielenie typów** między backendem a frontendem.
-   🤝 **Przyjazność dla LLM/agentów** (zoptymalizowana struktura DSL w TS/XML/JSON).
-   💰 **Minimalizacja użycia tokenów** w definicjach API.
-   🧠 **Jeden plik źródłowy** jako "centrum prawdy" dla endpointu/modelu.
-   🧩 **Wsparcie dla metadanych:** UI, commit hints, dokumentacja, dane testowe, konfiguracja i18n - wprowadzane **stopniowo, w miarę potrzeb**.
-   🎨 **Deklaratywne wskazówki UI** (styl MUI) generowane na podstawie schematów i opcjonalnych konfiguracji.
-   🚀 **Intuicyjne Doświadczenie Deweloperskie (DX)** jako klucz do zarządzania złożonością.

## 🏗️ Architecture

*(Struktura i technologie pozostają te same, ale podkreślamy modularność)*

### 1. System Layers
*(Bez zmian)*

### 2. Project Structure
*(Struktura pozostaje ta sama - wspiera modularność i wersjonowanie. Konwencje nazw plików i folderów mogą być wykorzystane do redukcji konfiguracji)*

### 3. Technology Stack
*(Bez zmian)*

## 📦 DSL Examples (Zaktualizowane - Pokazujące Stopniową Złożoność)

**Kluczowa zasada: Zaczynaj prosto, dodawaj funkcje w miarę potrzeb.**

### Minimalistyczny Przykład (Maksymalne wykorzystanie domyślnych i wnioskowania)

```typescript
// api/health.dsl.ts
import { checkHealth } from '../handlers/health';
import { z } from 'zod'; // Potrzebne tylko jeśli output nie jest inferowany

// Prosty handler, może zwracać np. { status: 'ok' }
// export async function checkHealth() { return { status: 'ok' }; }

export const healthApi = defineApi({
  'GET /health': {
    handler: checkHealth,
    // Opcjonalnie, jeśli chcemy być jawni lub handler jest złożony:
    // output: z.object({ status: z.string() }), 
    
    // Reszta jest domyślna:
    // - brak inputu (wnioskowane lub domyślnie {} )
    // - brak autoryzacji (security.required: false)
    // - brak tagów, opisu (documentation: {})
    // - brak UI Schema (ui: {})
    // - brak cachingu (performance: {})
    // - brak i18n, walidacji niestandardowej etc.
  }
});
```
*Ten przykład jest bardzo efektywny tokenowo i prosty do zrozumienia/generowania przez AI.*

### Przykład z Stopniowym Dodawaniem Funkcji

```typescript
// api/users.dsl.ts
import { z } from 'zod';
import { createUser, getUserById } from '../handlers/users';
import { UserInputSchema, UserModelSchema } from '../models/user.schemas'; // Załóżmy, że schematy są zdefiniowane gdzie indziej

export const userApi = defineApi({
  // --- Prosty GET z podstawową dokumentacją ---
  'GET /users/:id': {
    handler: getUserById,
    input: z.object({ id: z.string().uuid().describe('User ID') }), // Opis w Zod może być użyty przez dokumentację/UI
    output: UserModelSchema.omit({ password: true }), // Omit dla bezpieczeństwa

    // Opcjonalny blok dokumentacji
    documentation: {
      description: 'Fetch a user by ID',
      tags: ['users', 'read'],
      exampleOutput: { id: 'uuid-123', name: 'Alice', email: 'alice@example.com', role: 'user' }, // Może być generowane z output schema
    },
    // Opcjonalny blok bezpieczeństwa (domyślnie brak)
    security: {
      required: true, // Wymaga uwierzytelnienia
      // roles: ['admin'] // Opcjonalne role
    },
    // Opcjonalny blok wydajności (domyślnie brak cachingu)
    performance: {
      caching: { enabled: true, ttl: 60 } // Cache na 60 sekund
    },
    // Opcjonalny commit hint
    dev: {
       commitHint: 'Add user fetch endpoint GET /users/:id'
    }
  },

  // --- Bardziej złożony POST z UI Schema i walidacją ---
  'POST /users': {
    handler: createUser,
    input: UserInputSchema, // Użycie zdefiniowanego schematu
    output: UserModelSchema.omit({ password: true }),

    documentation: {
      description: 'Create a new user',
      tags: ['users', 'create'],
      exampleInput: { name: 'Bob', email: 'bob@example.com', password: 'password123', role: 'user' },
    },
    security: {
      required: true,
      roles: ['admin']
    },
    // Opcjonalny blok UI
    ui: {
      layout: 'form', // Wskazówka dla generatora UI
      fields: { // Nadpisania/dodatki do automatycznie generowanych z 'input' schema
        username: { label: 'i18n:user.username.label' }, // Użycie klucza i18n
        email: { type: 'email', label: 'i18n:user.email.label' },
        password: { type: 'password', label: 'i18n:user.password.label' },
        role: { 
          type: 'select', 
          label: 'i18n:user.role.label', 
          optionsKey: 'userRoles' // Wskazuje na predefiniowany zestaw opcji
          // Lub jawnie: options: [{ value: 'user', label: 'i18n:...' }, ...]
        }
      }
    },
    // Opcjonalny blok walidacji niestandardowej (oprócz Zod)
    validation: {
      custom: ['uniqueEmail'] // Odniesienie do predefiniowanego walidatora
    },
    // Opcjonalny blok i18n dla komunikatów endpointu
    i18n: {
       successMessageKey: 'user.create.success',
       errorMessageKey: 'user.create.error'
    },
    dev: {
      commitHint: 'Add user creation endpoint POST /users'
    }
  },
});

// Możliwość kompozycji (przykład koncepcyjny)
// import { createCrudEndpoints } from '@tokendsl/helpers';
// export const productApi = defineApi({
//   ...createCrudEndpoints({
//      modelName: 'Product',
//      schema: ProductSchema,
//      basePath: '/products',
//      handlersPath: '../handlers/products',
//      security: { create: ['admin'], update: ['admin'], delete: ['admin'] }
//   })
// });
```

*(Pozostałe definicje Service, Model, Endpoint mogą również przyjąć tę warstwową strukturę, grupując opcjonalne konfiguracje w bloki `documentation`, `relations`, `indexes`, `performance`, `security`, `ui`, `i18n`, `validation`, `dev` itp.)*

## ⚙️ Runtime Engine (Zaktualizowane)

*(Silnik pozostaje podobny, ale powinien być zaprojektowany tak, aby elegancko obsługiwać brakujące opcjonalne bloki, stosując domyślne wartości. Lepsze raportowanie błędów podczas parsowania DSL i uruchamiania handlerów jest kluczowe dla DX.)*

```typescript
// dsl-engine.ts (koncept)
export function applyApi(app, apiDefinition) {
  for (const [route, def] of Object.entries(apiDefinition)) {
    const [method, path] = route.split(' ');
    
    // Pobierz handler (rdzeń)
    const handler = def.handler; 
    if (!handler) throw new Error(`Missing handler for ${route}`);

    // Pobierz schematy (rdzeń) - z domyślnymi jeśli brak
    const inputSchema = def.input ?? z.any(); 
    const outputSchema = def.output ?? z.any(); 

    // Pobierz opcjonalne konfiguracje z domyślnymi
    const securityOptions = { required: false, roles: [], ...def.security };
    const cacheOptions = { enabled: false, ttl: 0, ...def.performance?.caching };
    const docOptions = { description: '', tags: [], ...def.documentation };
    // ... inne opcjonalne bloki

    // Zastosuj middleware (np. auth, caching, validation) na podstawie opcji
    const middlewares = [];
    if (securityOptions.required) middlewares.push(createAuthMiddleware(securityOptions));
    // ... inne middleware

    app[method.toLowerCase()](path, ...middlewares, async (req, res) => {
      try {
        // Walidacja wejścia (Zod + ew. niestandardowa z bloku 'validation')
        const data = await validateInput(inputSchema, def.validation?.custom, req);

        // Wywołanie handlera
        const result = await handler(data, req, res /* przekazanie kontekstu */);

        // Walidacja wyjścia (opcjonalna, ale zalecana)
        const finalResult = await validateOutput(outputSchema, result);
        
        // Obsługa cachingu (jeśli cacheOptions.enabled)
        // ...

        res.status(docOptions.successStatusCode ?? 200).json(finalResult);
      } catch (err) {
        // Lepsze logowanie błędów i mapowanie na kody statusu (z bloku 'documentation'?)
        logError(err, route);
        const statusCode = mapErrorToStatusCode(err, docOptions.errorStatusCodes);
        res.status(statusCode).json({ error: err.message /* lub bardziej strukturalny błąd */ });
      }
    });
  }
}
```

## 🌟 Key Features (Zaktualizowane)

*(Podkreślenie łatwości użycia dla standardowych przypadków)*

-   **API Versioning:** Intuicyjne, oparte na strukturze folderów.
-   **Internationalization (i18n):** Wsparcie dla plików `.mo` (lub innych formatów). **Automatyczne powiązanie kluczy** na podstawie konwencji, z możliwością jawnej konfiguracji w bloku `i18n`.
-   **Test Data:** Łatwe powiązanie danych testowych z modelami (blok `dev.testData`?).
-   **Validation:** Wbudowana walidacja Zod + opcjonalna walidacja niestandardowa (blok `validation`). Walidacja samego DSL podczas ładowania.
-   **Platform Support:** Elastyczność dzięki adapterom (Express, Fastify, Koa...).
-   **UI Generation:** **Automatyczne generowanie podstawowych schematów UI** na podstawie `input`/`output` Zod, z możliwością **szczegółowej konfiguracji** w opcjonalnym bloku `ui`.

## 🎨 Frontend Support

*(Bez większych zmian, ale generowane schematy będą prostsze domyślnie)*

## 🛠️ Developer Tools (Podniesiony Priorytet)

**Narzędzia są kluczowe do zarządzania złożonością DSL i zapewnienia płynnego doświadczenia:**

-   **CLI (`tokendsl`):**
    *   `init`: Inicjalizacja projektu z minimalną konfiguracją.
    *   `generate`: Generowanie kodu (backend, typy, *podstawowe* UI schema).
    *   `create endpoint/model`: Interaktywne tworzenie plików DSL z użyciem szablonów (proste lub zaawansowane).
    *   `validate`: Walidacja definicji DSL w projekcie.
    *   `docs generate`: Generowanie dokumentacji (np. OpenAPI) z bloku `documentation`.
    *   `i18n sync`: Synchronizacja kluczy i18n.
-   **VS Code Plugin (Kluczowy Element DX):**
    *   **Podświetlanie składni** DSL (.dsl.ts).
    *   **Zaawansowane Autouzupełnianie (IntelliSense):** Podpowiedzi dla wszystkich właściwości (w tym opcjonalnych bloków), typów i **dokumentacja inline** wyjaśniająca każdą opcję.
    *   **Snippets:** Fragmenty kodu dla typowych definicji (minimalny endpoint, endpoint z auth, model CRUD itp.).
    *   **Walidacja na Żywo:** Natychmiastowe wykrywanie błędów w DSL.
    *   **Podgląd (Preview):** Możliwość podglądu generowanego schematu UI lub dokumentacji dla danego endpointu.
    *   **Nawigacja:** Łatwe przechodzenie do handlerów, modeli, plików i18n.
-   **Debugging:** Jasne komunikaty błędów z runtime'u wskazujące na konkretny plik/linię w DSL.
-   **Dokumentacja i Tutoriale:** Bogata, interaktywna dokumentacja z licznymi przykładami (od "hello world" do złożonych mikroserwisów), najlepsze praktyki, tutoriale "krok po kroku".

## 🧪 Testing

*(Bez zmian)*

## 📈 Development Plan (Zaktualizowany Priorytet)

1.  **Faza 1: Fundamenty Rdzenia DSL i DX:**
    *   Implementacja **minimalnego, ale funkcjonalnego DSL** (definicja endpointu, modelu, serwisu).
    *   Podstawowy **silnik runtime** (np. dla Express).
    *   **Generator typów** TypeScript.
    *   **Kluczowe narzędzia DX:** Podstawowe CLI (`init`, `generate`, `validate`) oraz **rdzeń wtyczki VS Code** (podświetlanie, podstawowe autouzupełnianie, walidacja na żywo).
    *   Podstawowa walidacja schematów Zod.
2.  **Faza 2: Rozszerzenia DSL i Integracje:**
    *   Dodanie **opcjonalnych bloków** do DSL (security, documentation, ui, performance, i18n, validation, etc.).
    *   Rozbudowa silnika runtime o obsługę tych bloków (middleware, caching, etc.).
    *   Generowanie dokumentacji (OpenAPI).
    *   Wsparcie dla kolejnych platform backendowych (Fastify).
    *   Ulepszenie narzędzi DX (lepsze IntelliSense, snippets, nawigacja).
3.  **Faza 3: Frontend i Ekosystem:**
    *   Generator **schematów UI** i podstawowych komponentów (np. dla React + MUI).
    *   System motywów.
    *   Rozbudowa CLI (np. `create`, `i18n sync`).
    *   Zaawansowane funkcje wtyczki VS Code (podgląd UI).
4.  **Faza 4: Optymalizacje i Społeczność:**
    *   Optymalizacje wydajności.
    *   Wsparcie dla XML/JSON DSL.
    *   Budowanie społeczności, zbieranie feedbacku, tworzenie bibliotek pomocniczych (`@tokendsl/helpers`).

## 🤝 Conclusions and Recommendations (Zaktualizowane)

### 1. Priorities:
-   **Token Efficiency & AI Friendliness:** Nadal główny cel.
-   **Developer Experience (DX):** Kluczowy czynnik sukcesu - **prostota dla 80% przypadków**, moc dla 20%. Narzędzia są tu najważniejsze.
-   **Type Safety & Validation:** Niezbędne dla niezawodności.
-   **Modularity & Scalability:** Architektura musi wspierać rozwój.

### 2. Challenges:
-   **Balans Prostota vs Moc:** Ciągłe wyzwanie przy projektowaniu DSL. Warstwowość jest odpowiedzią.
-   **Jakość Narzędzi:** Sukces zależy od niezawodności i użyteczności CLI i wtyczki VS Code.
-   **Krzywa Uczenia:** Mimo starań, nowy DSL zawsze wymaga nauki - minimalizowane przez DX.
-   **Wydajność Runtime:** Warstwa abstrakcji nie może być zbyt kosztowna.

### 3. Next Steps (Zgodne z Planem):
1.  Zbudować **minimalny rdzeń DSL** i podstawowy runtime.
2.  Równolegle rozwijać **kluczowe funkcje DX** (CLI, VS Code Plugin) wspierające ten rdzeń.
3.  Iteracyjnie dodawać **opcjonalne bloki funkcjonalne** i rozbudowywać narzędzia.
4.  **Aktywnie zbierać feedback** od wczesnych użytkowników i dostosowywać DSL/narzędzia.

## 🔧 Implementation Details & 📊 TypeScript Type Definitions (Zaktualizowane)

*(Typy powinny odzwierciedlać opcjonalność bloków)*

```typescript
// Przykładowa zaktualizowana definicja typu Endpoint
export interface EndpointDefinition<T = any, R = any> {
  // --- Rdzeń (wymagane) ---
  handler: Handler<T, R>; 
  
  // --- Rdzeń (opcjonalne, mogą być inferowane/domyślne) ---
  input?: z.ZodType<T>;
  output?: z.ZodType<R>;

  // --- Opcjonalne Bloki Funkcjonalne ---
  security?: SecurityOptions;
  documentation?: DocumentationOptions;
  performance?: PerformanceOptions;
  ui?: UISchemaOptions;
  validation?: ValidationOptions;
  i18n?: I18nOptions;
  dev?: DevOptions; // np. commitHint, testData refs
  
  // ... inne potencjalne bloki
}

// Definicje dla opcjonalnych bloków
export interface SecurityOptions {
  required?: boolean;
  roles?: string[];
  permissions?: string[]; 
  // ... inne
}

export interface DocumentationOptions {
  description?: string;
  summary?: string;
  tags?: string[];
  exampleInput?: T;
  exampleOutput?: R;
  externalDocs?: { url: string; description?: string };
  successStatusCode?: number;
  errorStatusCodes?: Record<string, number>; // mapowanie typów błędów na kody
  // ... inne
}

export interface PerformanceOptions {
   caching?: {
     enabled?: boolean;
     ttl?: number; // w sekundach
     key?: string | ((req: any) => string); // strategia klucza cache
   };
   rateLimit?: { // przykład innej opcji
     maxRequests: number;
     windowMs: number;
   };
}

// ... definicje dla UI, Validation, I18n, Dev etc.
```

## 🎨 XML Representation (Zaktualizowane)

*(XML również powinien odzwierciedlać strukturę warstwową z opcjonalnymi blokami)*

```xml
<!-- Minimalistyczny Przykład -->
<endpoint method="GET" path="/health" handler="handlers/health:checkHealth" /> 
<!-- Dużo domyślnych założeń -->

<!-- Przykład z Opcjonalnymi Blokami -->
<endpoint method="POST" path="/users" handler="handlers/users:createUser">
  <input schemaRef="UserInputSchema" />
  <output schemaRef="UserModelSchema" omit="password" />

  <security required="true">
    <role>admin</role>
  </security>

  <documentation description="Create a new user">
    <tag>users</tag>
    <tag>create</tag>
    <example type="input" ref="examples/users/create-input.json" />
  </documentation>

  <ui layout="form">
    <field name="username" label="i18n:user.username.label" />
    <field name="email" type="email" label="i18n:user.email.label" />
    <!-- ... -->
  </ui>
  
  <validation>
    <custom ref="uniqueEmail" />
  </validation>

  <dev commitHint="Add user creation endpoint POST /users" />
</endpoint>
```

## 🌟 Summary (Zaktualizowane)

TokenDSL to innowacyjny system tworzenia API, który **równoważy moc i elastyczność z prostotą użycia i doskonałym doświadczeniem deweloperskim (DX)**. Łączy:
-   **Efektywność tokenową** i przyjazność dla AI.
-   Bezpieczeństwo typów TypeScript i walidację Zod.
-   **Deklaratywność DSL z warstwową złożonością:** Proste rzeczy są proste, złożone są możliwe.
-   Automatyczne generowanie kodu (backend, typy, UI, dokumentacja).
-   **Potężne narzędzia deweloperskie** (CLI, VS Code) jako klucz do łatwej pracy z DSL.
-   Wsparcie dla wielu platform, wersjonowania i i18n.

Skupiając się na **stopniowym ujawnianiu złożoności** i **intuicyjnych narzędziach**, TokenDSL ma na celu radykalne przyspieszenie i ujednolicenie procesu tworzenia API, szczególnie w środowiskach wykorzystujących AI do wspomagania rozwoju.

---