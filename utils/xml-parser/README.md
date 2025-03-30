# XML Structure Parser

Narzędzie do parsowania struktury XML i generowania plików TypeScript.

## Instalacja

```bash
cd utils/xml-parser
npm install
```

## Użycie

1. Skompiluj projekt:
```bash
npm run build
```

2. Uruchom narzędzie:
```bash
npm start
```

## Struktura projektu

- `src/index.ts` - główny plik aplikacji
- `src/parser.ts` - parser XML
- `src/generator.ts` - generator plików
- `src/types.ts` - definicje typów
- `src/utils.ts` - funkcje pomocnicze

## Format XML

Narzędzie oczekuje pliku XML w następującym formacie:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project>
    <name>NazwaProjektu</name>
    <version>1.0.0</version>
    <directory name="src">
        <directory name="types">
            <file name="index.ts">
                <interface name="User">
                    <property name="id" type="string" />
                    <property name="email" type="string" />
                    <property name="name" type="string" optional="true" />
                </interface>
                <type name="UserRole">'admin' | 'user' | 'guest'</type>
            </file>
        </directory>
    </directory>
</project>
```

## Generowane pliki

Narzędzie generuje pliki TypeScript z interfejsami i typami zdefiniowanymi w XML. Przykład wygenerowanego pliku:

```typescript
export interface User {
    id: string;
    email: string;
    name?: string;
}

export type UserRole = 'admin' | 'user' | 'guest';
``` 