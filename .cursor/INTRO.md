# TokenDSL - Token-Efficient Backend DSL for AI Integration

## Project Overview

TokenDSL is an innovative, minimalist domain-specific language (DSL) designed for declaratively describing backend APIs in an AI-friendly way. Our system enables rapid creation, validation, and deployment of APIs with full TypeScript support, automatic type sharing between frontend and backend, and minimal token usage for optimal language model efficiency.

## Why TokenDSL?

- **Less boilerplate code** - define entire APIs in concise, declarative syntax
- **Automatic validation and typing** - integrated with Zod for runtime type safety
- **Type sharing** - automatic type synchronization between backend and frontend
- **AI-friendly** - XML/JSON structure facilitating generation and analysis by language models
- **Token efficiency** - optimized for minimal token usage by LLMs
- **Single source of truth** - all endpoint aspects in one place
- **API versioning** - built-in support for maintaining multiple API versions in parallel
- **Internationalization (i18n)** - native translation support
- **Test data** - integrated sample data for models, facilitating testing and development
- **UI Hints** - automatic UI generation based on schemas

## System Architecture
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


