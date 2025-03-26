# TokenDSL - Token-Efficient Backend DSL dla Integracji z AI

## Przegląd projektu

TokenDSL to innowacyjny, minimalistyczny język specyficzny dla domeny (DSL), zaprojektowany do deklaratywnego opisywania backend API w sposób przyjazny dla AI. Nasz system pozwala na szybkie tworzenie, walidowanie i wdrażanie API z pełnym wsparciem TypeScript, automatycznym współdzieleniem typów między frontendem i backendem, oraz minimalnym zużyciem tokenów dla optymalnej wydajności modeli językowych.

## Dlaczego TokenDSL?

-   **Mniej kodu boilerplate** - definiuj całe API w zwięzłej, deklaratywnej składni
-   **Automatyczna walidacja i typowanie** - zintegrowane z Zod dla bezpieczeństwa typów w runtime
-   **Współdzielenie typów** - automatyczna synchronizacja typów między backendem i frontendem
-   **Przyjazny dla AI** - struktura XML/JSON ułatwiająca generowanie i analizowanie przez modele językowe
-   **Efektywność tokenowa** - zoptymalizowany dla minimalnego zużycia tokenów przez LLM
-   **Jedno źródło prawdy** - wszystkie aspekty endpointu w jednym miejscu
-   **Wersjonowanie API** - wbudowane wsparcie dla równoległego utrzymywania wielu wersji API
-   **Wielojęzyczność (i18n)** - natywne wsparcie dla tłumaczeń
-   **Dane testowe** - zintegrowane przykładowe dane dla modeli, ułatwiające testowanie i rozwój
-   **UI Hints** - automatyczne generowanie UI na podstawie schematów

## Architektura systemu

mermaid

Copy

`flowchart TD     classDef dsl fill:#ebf8ff,stroke:#3182ce,color:#2c5282    classDef framework fill:#e6fffa,stroke:#319795,color:#234e52    classDef api fill:#edf2ff,stroke:#4c51bf,color:#3c366b    classDef client fill:#faf5ff,stroke:#805ad5,color:#44337a     dsl["DSL Definitions"] --> service1["users-service-v1.0\nindex.dsl.ts"]    dsl --> service2["orders-service-v2.0\nindex.dsl.ts"]         service1 --> models1["Models\n- user.model.dsl.ts"]    service1 --> endpoints1["Endpoints\n- users.endpoints.dsl.ts"]    service1 --> i18n1["i18n\n- translations"]    service1 --> testdata1["Test Data\n- sample data"]     service1 & service2 --> loader["DSL Loader"]    loader --> validator["DSL Validator"]    validator --> generator["Code Generator"]    generator --> manager["Services Manager"]     manager --> usersAPI["Users API\nExpress - Port 3001"]    manager --> ordersAPI["Orders API\nFastify - Port 3002"]     usersAPI & ordersAPI --> react["Frontend Applications"]    usersAPI & ordersAPI --> swagger["API Documentation"]    usersAPI & ordersAPI --> types["TypeScript Types"]     class dsl,service1,service2,models1,endpoints1,i18n1,testdata1 dsl    class loader,validator,generator,manager framework    class usersAPI,ordersAPI api    class react,swagger,types client`

## Struktura projektu

Copy

`project-root/ ├── dsl/                                # Definicje DSL │   ├── users-service-v1.0/             # Serwis users (wersja 1.0) │   │   ├── index.dsl.ts                # Główny plik definicji serwisu │   │   ├── models/                     # Modele danych │   │   ├── endpoints/                  # Endpointy │   │   ├── i18n/                       # Tłumaczenia │   │   └── test-data/                  # Dane testowe │   └── orders-service-v2.0/            # Serwis orders (wersja 2.0) ├── src/                                # Kod źródłowy backendu │   ├── server.ts                       # Główny serwer │   ├── dsl-loader.ts                   # Loader plików DSL │   └── services-manager.ts             # Zarządzanie serwisami └── config/                             # Konfiguracja projektu`

## Przykład DSL

### Definicja serwisu

typescript

Copy

`// dsl/users-service-v1.0/index.dsl.ts import { defineService } from '@tokendsl/core'; import * as userEndpoints from './endpoints/users.endpoints.dsl'; import * as authEndpoints from './endpoints/auth.endpoints.dsl'; import { serviceConfig } from './service.config.dsl'; export default defineService({   name: 'users-service',  version: '1.0',  config: serviceConfig,  endpoints: {    ...userEndpoints,    ...authEndpoints  } });`

### Definicja modelu

typescript

Copy

`// dsl/users-service-v1.0/models/user.model.dsl.ts import { defineModel, z } from '@tokendsl/core'; export const UserModel = defineModel({   name: 'User',  schema: z.object({    id: z.string().uuid().describe('User ID'),    username: z.string().min(3).max(50).describe('Username'),    email: z.string().email().describe('Email address'),    role: z.enum(['user', 'admin']).describe('User role')  }),  testData: './test-data/users.data.json' });`

### Definicja endpointu

typescript

Copy

`// dsl/users-service-v1.0/endpoints/users.endpoints.dsl.ts import { defineEndpoints, z } from '@tokendsl/core'; import { UserModel } from '../models/user.model.dsl'; export default defineEndpoints({   'GET /users': {    description: 'Get all users',    version: '1.0',    tags: ['users'],    auth: { required: true, roles: ['admin'] },    input: z.object({      page: z.number().optional().default(1),      limit: z.number().optional().default(10)    }),    output: z.object({      users: z.array(UserModel.schema),      total: z.number()    }),    handler: 'handlers/users/getUsers'  },     'POST /users': {    description: 'Create a new user',    version: '1.0',    tags: ['users'],    input: UserModel.schema.omit({ id: true }),    output: UserModel.schema,    handler: 'handlers/users/createUser',    uiSchema: {      layout: 'form',      fields: {        username: { type: 'text', label: 'i18n:user.username' },        email: { type: 'email', label: 'i18n:user.email' },        role: { type: 'select', label: 'i18n:user.role' }      }    }  } });`

## Alternatywna składnia XML

xml

Copy

`<?xml version="1.0" encoding="UTF-8"?> <tokenDSL version="1.0">   <api name="userApi" prefix="/api/v1">    <endpoint method="GET" path="/users/:id">      <description>Fetch a user by ID</description>      <tags>        <tag>users</tag>        <tag>read</tag>      </tags>      <input>        <schema>          <object>            <property name="id" type="string" description="User ID" />          </object>        </schema>      </input>      <handler file="handlers/users.ts" function="getUserById" />      <uiSchema>        <layout>card</layout>        <fields>          <field name="id">            <type>text</type>            <label>User ID</label>            <display>readonly</display>          </field>        </fields>      </uiSchema>    </endpoint>  </api> </tokenDSL>`

## Przepływ danych

mermaid

Copy

`graph LR     classDef files fill:#e2e8f0,stroke:#4a5568,color:#2d3748    classDef process fill:#ebf8ff,stroke:#3182ce,color:#2c5282    classDef output fill:#e6fffa,stroke:#319795,color:#234e52    classDef deploy fill:#edf2ff,stroke:#4c51bf,color:#3c366b     dslFiles[".dsl.ts files"] --> loader[DSL Loader]    i18nFiles["Translation files"] --> i18nLoader[i18n Loader]    testDataFiles["Test Data files"] --> dataLoader[Test Data Loader]         loader --> validator[DSL Validator]    validator --> serviceRegistry[Service Registry]         serviceRegistry --> codeGen[Code Generator]    i18nLoader --> codeGen    dataLoader --> codeGen         codeGen --> expressCode[Backend Code]    codeGen --> tsTypes[TypeScript Types]    codeGen --> apiDocs[API Docs]    codeGen --> uiSchema[UI Components]         serviceRegistry --> serviceManager[Services Manager]    serviceManager --> deployServices[Deploy Services]         tsTypes & uiSchema --> frontendApp[Frontend App]    apiDocs --> docPortal[API Portal]         class dslFiles,i18nFiles,testDataFiles files    class loader,validator,i18nLoader,dataLoader process    class serviceRegistry,codeGen,expressCode,tsTypes,apiDocs,uiSchema output    class serviceManager,deployServices,frontendApp,docPortal deploy`

## Główne komponenty

1.  **DSL Loader** - Ładuje i parsuje pliki DSL, przygotowując je do przetworzenia
2.  **DSL Validator** - Sprawdza poprawność definicji DSL
3.  **Code Generator** - Generuje kod API, typy TypeScript i dokumentację
4.  **Services Manager** - Uruchamia, zatrzymuje i monitoruje wygenerowane serwisy API

## Korzyści dla zespołu

-   **Szybszy development** - mniej kodu do napisania, więcej zautomatyzowanych procesów
-   **Lepsza współpraca** - ujednolicona struktura ułatwia współpracę między zespołami
-   **Dokumentacja jako kod** - dokumentacja zawsze aktualna, generowana z definicji
-   **Utrzymanie wielu wersji** - łatwe zarządzanie różnymi wersjami API
-   **Integracja z AI** - idealna podstawa dla generatywnego AI i narzędzi LLM
-   **Redukcja błędów** - walidacja typów i automatyczne testy
-   **Szybsze prototypowanie** - od koncepcji do działającego API w minuty, nie godziny

## Roadmapa

-   **Q2 2025**: Pierwsza wersja stabilna z wsparciem dla Express
-   **Q3 2025**: Dodanie wsparcia dla Fastify i tRPC
-   **Q4 2025**: Generator UI dla React i Vue
-   **Q1 2026**: Integracja z narzędziami CI/CD

## Podsumowanie

TokenDSL to przełomowe rozwiązanie do definiowania, walidowania i wdrażania API w sposób wydajny, typowo bezpieczny i przyjazny dla AI. Dzięki naszemu podejściu możemy znacząco przyspieszyć tworzenie aplikacji backendowych, jednocześnie poprawiając ich jakość i utrzymywalność. TokenDSL idealnie nadaje się do nowoczesnych workflows z użyciem generatywnego AI, zapewniając strukturę, która jest jednocześnie zrozumiała dla ludzi i efektywna dla modeli językowych.




# TokenDSL - Token-Efficient Backend DSL dla Integracji z AI

## Przegląd projektu

TokenDSL to innowacyjny, minimalistyczny język specyficzny dla domeny (DSL), zaprojektowany do deklaratywnego opisywania backend API w sposób przyjazny dla AI. Nasz system pozwala na szybkie tworzenie, walidowanie i wdrażanie API z pełnym wsparciem TypeScript, automatycznym współdzieleniem typów między frontendem i backendem, oraz minimalnym zużyciem tokenów dla optymalnej wydajności modeli językowych.

## Dlaczego TokenDSL?

- **Mniej kodu boilerplate** - definiuj całe API w zwięzłej, deklaratywnej składni
- **Automatyczna walidacja i typowanie** - zintegrowane z Zod dla bezpieczeństwa typów w runtime
- **Współdzielenie typów** - automatyczna synchronizacja typów między backendem i frontendem
- **Przyjazny dla AI** - struktura XML/JSON ułatwiająca generowanie i analizowanie przez modele językowe
- **Efektywność tokenowa** - zoptymalizowany dla minimalnego zużycia tokenów przez LLM
- **Jedno źródło prawdy** - wszystkie aspekty endpointu w jednym miejscu
- **Wersjonowanie API** - wbudowane wsparcie dla równoległego utrzymywania wielu wersji API
- **Wielojęzyczność (i18n)** - natywne wsparcie dla tłumaczeń
- **Dane testowe** - zintegrowane przykładowe dane dla modeli, ułatwiające testowanie i rozwój
- **UI Hints** - automatyczne generowanie UI na podstawie schematów

## Architektura systemu

```mermaid
flowchart TD
    classDef dsl fill:#ebf8ff,stroke:#3182ce,color:#2c5282
    classDef framework fill:#e6fffa,stroke:#319795,color:#234e52
    classDef api fill:#edf2ff,stroke:#4c51bf,color:#3c366b
    classDef client fill:#faf5ff,stroke:#805ad5,color:#44337a

    dsl["DSL Definitions"] --> service1["users-service-v1.0\nindex.dsl.ts"]
    dsl --> service2["orders-service-v2.0\nindex.dsl.ts"]
    
    service1 --> models1["Models\n- user.model.dsl.ts"]
    service1 --> endpoints1["Endpoints\n- users.endpoints.dsl.ts"]
    service1 --> i18n1["i18n\n- translations"]
    service1 --> testdata1["Test Data\n- sample data"]

    service1 & service2 --> loader["DSL Loader"]
    loader --> validator["DSL Validator"]
    validator --> generator["Code Generator"]
    generator --> manager["Services Manager"]

    manager --> usersAPI["Users API\nExpress - Port 3001"]
    manager --> ordersAPI["Orders API\nFastify - Port 3002"]

    usersAPI & ordersAPI --> react["Frontend Applications"]
    usersAPI & ordersAPI --> swagger["API Documentation"]
    usersAPI & ordersAPI --> types["TypeScript Types"]

    class dsl,service1,service2,models1,endpoints1,i18n1,testdata1 dsl
    class loader,validator,generator,manager framework
    class usersAPI,ordersAPI api
    class react,swagger,types client

    Struktura projektu
Copyproject-root/
├── dsl/                                # Definicje DSL
│   ├── users-service-v1.0/             # Serwis users (wersja 1.0)
│   │   ├── index.dsl.ts                # Główny plik definicji serwisu
│   │   ├── models/                     # Modele danych
│   │   ├── endpoints/                  # Endpointy
│   │   ├── i18n/                       # Tłumaczenia
│   │   └── test-data/                  # Dane testowe
│   └── orders-service-v2.0/            # Serwis orders (wersja 2.0)
├── src/                                # Kod źródłowy backendu
│   ├── server.ts                       # Główny serwer
│   ├── dsl-loader.ts                   # Loader plików DSL
│   └── services-manager.ts             # Zarządzanie serwisami
└── config/                             # Konfiguracja projektu
Przykład DSL
Definicja serwisu
typescriptCopy// dsl/users-service-v1.0/index.dsl.ts
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
Definicja modelu
typescriptCopy// dsl/users-service-v1.0/models/user.model.dsl.ts
import { defineModel, z } from '@tokendsl/core';

export const UserModel = defineModel({
  name: 'User',
  schema: z.object({
    id: z.string().uuid().describe('User ID'),
    username: z.string().min(3).max(50).describe('Username'),
    email: z.string().email().describe('Email address'),
    role: z.enum(['user', 'admin']).describe('User role')
  }),
  testData: './test-data/users.data.json'
});
Definicja endpointu
typescriptCopy// dsl/users-service-v1.0/endpoints/users.endpoints.dsl.ts
import { defineEndpoints, z } from '@tokendsl/core';
import { UserModel } from '../models/user.model.dsl';

export default defineEndpoints({
  'GET /users': {
    description: 'Get all users',
    version: '1.0',
    tags: ['users'],
    auth: { required: true, roles: ['admin'] },
    input: z.object({
      page: z.number().optional().default(1),
      limit: z.number().optional().default(10)
    }),
    output: z.object({
      users: z.array(UserModel.schema),
      total: z.number()
    }),
    handler: 'handlers/users/getUsers'
  },
  
  'POST /users': {
    description: 'Create a new user',
    version: '1.0',
    tags: ['users'],
    input: UserModel.schema.omit({ id: true }),
    output: UserModel.schema,
    handler: 'handlers/users/createUser',
    uiSchema: {
      layout: 'form',
      fields: {
        username: { type: 'text', label: 'i18n:user.username' },
        email: { type: 'email', label: 'i18n:user.email' },
        role: { type: 'select', label: 'i18n:user.role' }
      }
    }
  }
});
Alternatywna składnia XML
xmlCopy<?xml version="1.0" encoding="UTF-8"?>
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
      <handler file="handlers/users.ts" function="getUserById" />
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
    </endpoint>
  </api>
</tokenDSL>


Przepływ danych
mermaidCopygraph LR
    classDef files fill:#e2e8f0,stroke:#4a5568,color:#2d3748
    classDef process fill:#ebf8ff,stroke:#3182ce,color:#2c5282
    classDef output fill:#e6fffa,stroke:#319795,color:#234e52
    classDef deploy fill:#edf2ff,stroke:#4c51bf,color:#3c366b

    dslFiles[".dsl.ts files"] --> loader[DSL Loader]
    i18nFiles["Translation files"] --> i18nLoader[i18n Loader]
    testDataFiles["Test Data files"] --> dataLoader[Test Data Loader]
    
    loader --> validator[DSL Validator]
    validator --> serviceRegistry[Service Registry]
    
    serviceRegistry --> codeGen[Code Generator]
    i18nLoader --> codeGen
    dataLoader --> codeGen
    
    codeGen --> expressCode[Backend Code]
    codeGen --> tsTypes[TypeScript Types]
    codeGen --> apiDocs[API Docs]
    codeGen --> uiSchema[UI Components]
    
    serviceRegistry --> serviceManager[Services Manager]
    serviceManager --> deployServices[Deploy Services]
    
    tsTypes & uiSchema --> frontendApp[Frontend App]
    apiDocs --> docPortal[API Portal]
    
    class dslFiles,i18nFiles,testDataFiles files
    class loader,validator,i18nLoader,dataLoader process
    class serviceRegistry,codeGen,expressCode,tsTypes,apiDocs,uiSchema output
    class serviceManager,deployServices,frontendApp,docPortal deploy


Główne komponenty
-----------------

1.  **DSL Loader** - Ładuje i parsuje pliki DSL, przygotowując je do przetworzenia
2.  **DSL Validator** - Sprawdza poprawność definicji DSL
3.  **Code Generator** - Generuje kod API, typy TypeScript i dokumentację
4.  **Services Manager** - Uruchamia, zatrzymuje i monitoruje wygenerowane serwisy API

Korzyści dla zespołu
--------------------

*   **Szybszy development** - mniej kodu do napisania, więcej zautomatyzowanych procesów
*   **Lepsza współpraca** - ujednolicona struktura ułatwia współpracę między zespołami
*   **Dokumentacja jako kod** - dokumentacja zawsze aktualna, generowana z definicji
*   **Utrzymanie wielu wersji** - łatwe zarządzanie różnymi wersjami API
*   **Integracja z AI** - idealna podstawa dla generatywnego AI i narzędzi LLM
*   **Redukcja błędów** - walidacja typów i automatyczne testy
*   **Szybsze prototypowanie** - od koncepcji do działającego API w minuty, nie godziny

Roadmapa
--------

*   **Q2 2025**: Pierwsza wersja stabilna z wsparciem dla Express
*   **Q3 2025**: Dodanie wsparcia dla Fastify i tRPC
*   **Q4 2025**: Generator UI dla React i Vue
*   **Q1 2026**: Integracja z narzędziami CI/CD

Podsumowanie
------------

TokenDSL to przełomowe rozwiązanie do definiowania, walidowania i wdrażania API w sposób wydajny, typowo bezpieczny i przyjazny dla AI. Dzięki naszemu podejściu możemy znacząco przyspieszyć tworzenie aplikacji backendowych, jednocześnie poprawiając ich jakość i utrzymywalność. TokenDSL idealnie nadaje się do nowoczesnych workflows z użyciem generatywnego AI, zapewniając strukturę, która jest jednocześnie zrozumiała dla ludzi i efektywna dla modeli językowych.


-----

bardzo waznym dodaktowym serwisem jest sotrona glowna i dokumencaj w md na niej czy np po /md/ gdzie llms moga sobie wejsc i przeczyac jakaktualnie wygnerowac dsl dla naszego serwera. - przyklady w isntrukcjach maja nie byc pisane recznie ale tez maja byc includami dzialajacego przetestowanego kodu, zas jesli beda jakies templates w nim to tez maja byc kodem jaki istnieje w repo a nie kopia, czyli dokumacja nie moze dupliokoac prawdy ale tylko ja replikowac a najlepiej publikowac bezposredsnio z innych zriodel prawndy! glownie z przykladowego testowego serera
innym waznym dodatkiem z czaem bedzie backendowe api gdzie mozna sprawdzic status naszego serwera, etc ale to kiedys.  n


