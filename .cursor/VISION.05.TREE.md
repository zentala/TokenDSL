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