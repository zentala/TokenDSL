Rozwiązanie problemu złożoności DSL (Problem #1) jest kluczowe dla adopcji i użyteczności TokenDSL. Oto kilka strategii, jak można by to zaadresować, pamiętając o głównym celu (efektywność tokenów i przyjazność dla AI):

1.  **Warstwowość / Stopniowe Ujawnianie Złożoności (Progressive Disclosure):**
    *   **Rdzeń Minimalny:** Zdefiniuj absolutnie minimalny zestaw właściwości wymaganych do zdefiniowania endpointu (np. `ścieżka + metoda`, `handler`, podstawowy `input`/`output` - być może nawet z inferencją typów z `handler`a, jeśli to możliwe).
    *   **Opcjonalne Bloki Funkcjonalne:** Zgrupuj bardziej zaawansowane funkcje w opcjonalne obiekty. Użytkownik dodaje je tylko wtedy, gdy są potrzebne. Np.:
        ```typescript
        'GET /users/:id': {
          handler: getUserById,
          input: z.object({ id: z.string() }), // Rdzeń
          // Opcjonalne rozszerzenia:
          documentation: { // Zamiast description, tags, examples etc. na top-level
            description: 'Fetch a user by ID',
            tags: ['users', 'read'],
            exampleOutput: { id: '123', ... },
          },
          ui: { // Zamiast uiSchema na top-level
             layout: 'card',
             fields: { ... }
          },
          security: { // Zamiast auth na top-level
             required: true,
             roles: ['admin']
          },
          performance: { // Zamiast caching na top-level
            caching: { enabled: true, ttl: 60 }
          },
          // ... i inne jak i18n, validation etc.
        }
        ```
    *   **Wnioskowanie Typów:** Tam, gdzie to możliwe, próbuj wnioskować konfigurację. Np. prosty `uiSchema` może być częściowo wygenerowany na podstawie schematu Zod (`z.string()` -> `type: 'text'`, `z.number()` -> `type: 'number'`).

2.  **Mądre Domyślne Ustawienia (Sensible Defaults):**
    *   Ustal rozsądne wartości domyślne dla wielu opcji (np. `auth.required: false`, `caching.enabled: false`, standardowe kody statusu dla sukcesu/błędu).
    *   Dzięki temu proste przypadki użycia wymagają minimalnej konfiguracji. Użytkownik nadpisuje tylko to, co odbiega od standardu.

3.  **Konwencja ponad Konfiguracją (Convention over Configuration):**
    *   Ustal jasne konwencje nazewnicze i strukturalne, które redukują potrzebę jawnej konfiguracji. Np. jeśli plik handlera znajduje się w standardowej lokalizacji (`handlers/users/getUserById.ts`), może DSL mógłby go znaleźć automatycznie lub wymagać krótszej ścieżki.
    *   Podobnie z kluczami i18n - jeśli będą podążać za wzorcem, DSL może je automatycznie powiązać.

4.  **Narzędzia Deweloperskie (DX) jako Klucz:**
    *   **Doskonałe Autouzupełnianie (IntelliSense):** Wtyczka VS Code musi podpowiadać dostępne właściwości, ich typy i (co ważne) dokumentację inline (np. JSDoc). To znacznie obniża barierę wejścia i potrzebę pamiętania wszystkich opcji.
    *   **Snippets:** Stwórz fragmenty kodu dla typowych wzorców (definicja endpointu GET, POST, definicja modelu), co przyspieszy pracę i pokaże strukturę.
    *   **Walidacja w Czasie Rzeczywistym:** Natychmiastowe wskazywanie błędów w definicji DSL w edytorze.
    *   **Dokumentacja i Przykłady:** Bogata dokumentacja z wieloma przykładami, od najprostszych do zaawansowanych, jest absolutnie niezbędna. Tutoriale "krok po kroku".

5.  **Modularyzacja i Kompozycja:**
    *   Zachęcaj do dzielenia dużych definicji API na mniejsze pliki (co już jest w strukturze projektu).
    *   Rozważ możliwość tworzenia "prefabrykatów" lub funkcji wyższego rzędu do generowania typowych zestawów endpointów (np. `createCrudEndpoints(model, options)`), które ukryłyby powtarzalną część definicji dla standardowych operacji CRUD. Użycie ich byłoby opcjonalne.

6.  **Uproszczenie Składni (Tam, gdzie to możliwe bez utraty mocy):**
    *   Regularnie przeglądaj składnię DSL. Czy nazwy właściwości są intuicyjne? Czy struktura jest logiczna? Czy można coś uprościć? Np. czy `commitHint` jest na tyle kluczowy, by być na najwyższym poziomie? Może powinien być w sekcji `meta` lub `dev`?
    *   XML vs TS: Upewnij się, że obie reprezentacje są równie "proste" w podstawowych przypadkach użycia.

7.  **Zbieranie Feedbacku:** Aktywnie zbieraj opinie od pierwszych użytkowników na temat tego, co jest dla nich skomplikowane lub nieintuicyjne i iteracyjnie ulepszaj DSL.

**Przykład zastosowania warstwowości i domyślnych:**

```typescript
// Bardzo prosty endpoint - reszta domyślna lub niepotrzebna
'GET /health': {
  handler: checkHealth,
  // output domyślnie np. z.any() lub inferowany z return type handlera
  // auth domyślnie false
  // caching domyślnie false
  // brak ui, i18n, validation etc.
}

// Bardziej złożony, ale tylko z potrzebnymi opcjami
'POST /users': {
  handler: createUser,
  input: UserInputSchema,
  output: UserModel.schema.omit({ password: true }), // nadal w miarę zwięzłe
  security: { // tylko sekcja security jest dodana
    required: true,
    roles: ['admin']
  },
  documentation: { // tylko sekcja dokumentacji
     description: 'Create a new user',
     tags: ['users', 'create']
  }
  // Nadal brak np. ui, caching, zaawansowanej walidacji...
}
```

Kluczem jest znalezienie złotego środka między bogactwem funkcji a prostotą użycia dla najczęstszych przypadków, przy jednoczesnym umożliwieniu rozszerzenia dla bardziej złożonych scenariuszy. Warstwowość i doskonałe narzędzia wydają się tutaj najważniejsze.