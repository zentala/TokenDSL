# TokenDSL Demo

## 🎯 Co to jest TokenDSL Demo?
TokenDSL Demo to interaktywna aplikacja demonstracyjna, która pokazuje możliwości systemu TokenDSL - narzędzia do tworzenia aplikacji webowych w sposób token-efektywny (oszczędzający tokeny AI) i szybki.

## 🚀 Główne funkcje

### 1. DSL Playground
- Interaktywny edytor do pisania i testowania kodu DSL
- Podświetlanie składni
- Auto-uzupełnianie
- Walidacja na żywo
- Podgląd wyników w czasie rzeczywistym
- Integracja z edytorem Monaco (ten sam co w VS Code)

### 2. Galeria Komponentów
- Pokaz wszystkich dostępnych komponentów UI
- Interaktywne przykłady
- Dokumentacja propsów
- Możliwość dostosowania motywu
- Edycja na żywo
- Wyszukiwanie i filtrowanie

### 3. Model Builder
- Wizualny interfejs do definiowania modeli danych
- Drag & drop pól
- Walidacja reguł
- Definiowanie relacji
- Generowanie kodu DSL
- Podgląd schematu

## 🏗️ Architektura

### Komponenty
1. **Podstawowe komponenty UI**
   - Button - przyciski z różnymi wariantami
   - Input - pola formularzy
   - Card - kontenery z różnymi stylami

2. **Komponenty formularzy**
   - Form - kontener formularza
   - Select - listy rozwijane
   - Checkbox - pola wyboru

3. **Komponenty layoutu**
   - Grid - układ siatkowy
   - Stack - układ stosowy
   - Modal - okna dialogowe

4. **Komponenty danych**
   - Table - tabele z sortowaniem i filtrowaniem
   - Chart - wizualizacje danych
   - Calendar - kalendarz z obsługą zdarzeń

### Modele danych
1. **Component**
   - Nazwa i opis
   - Lista funkcji
   - Dokumentacja propsów
   - Przykłady użycia
   - Kategorie i tagi
   - Zależności

2. **DSLExample**
   - Tytuł i opis
   - Kod przykładowy
   - Podgląd
   - Kategorie i tagi
   - Poziom trudności
   - Powiązane przykłady

3. **Theme**
   - Nazwa motywu
   - Kolory
   - Typografia
   - Spacing
   - Style komponentów

## 🔌 API Endpointy

### GET /api/components
- Zwraca listę wszystkich dostępnych komponentów
- Możliwość filtrowania po kategoriach i tagach

### GET /api/examples
- Zwraca listę przykładów użycia DSL
- Możliwość filtrowania po poziomie trudności

### POST /api/validate
- Waliduje kod DSL
- Zwraca listę błędów i ostrzeżeń

### GET /api/themes
- Zwraca listę dostępnych motywów
- Zawiera pełną konfigurację każdego motywu

### POST /api/preview
- Generuje podgląd dla kodu DSL
- Zwraca renderowany komponent

## 🛠️ Jak używać?

### 1. Rozpoczęcie pracy
```bash
# Instalacja zależności
npm install

# Uruchomienie w trybie deweloperskim
npm run dev
```

### 2. Struktura projektu
```
demo/
├── components/     # Komponenty React
├── pages/         # Strony aplikacji
├── layouts/       # Układy stron
├── api/           # Endpointy API
├── models/        # Modele danych
└── themes/        # Motywy aplikacji
```

### 3. Przykład użycia DSL
```typescript
// Przykład definicji komponentu w DSL
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

## 🤝 Integracja z TokenDSL

### 1. Backend
- Demo korzysta z backendu TokenDSL do:
  - Walidacji kodu DSL
  - Generowania typów TypeScript
  - Zarządzania schematami danych
  - Obsługi API

### 2. Komponenty
- Wszystkie komponenty są generowane na podstawie definicji DSL
- Wykorzystują Material-UI (MUI) jako bibliotekę bazową
- Możliwość dostosowania wyglądu przez motywy

### 3. Dane
- Dane są pobierane z backendu TokenDSL
- Automatyczna synchronizacja schematów
- Wsparcie dla wersjonowania API

## 🎨 Motywy i Stylizacja

### 1. Wbudowane motywy
- Light - jasny motyw domyślny
- Dark - ciemny motyw
- Custom - możliwość tworzenia własnych motywów

### 2. Dostosowanie
- Zmiana kolorów
- Dostosowanie typografii
- Kontrola odstępów
- Style komponentów

## 📚 Dokumentacja

### 1. Komponenty
- Szczegółowy opis każdego komponentu
- Przykłady użycia
- Dokumentacja propsów
- Najlepsze praktyki

### 2. DSL
- Składnia i gramatyka
- Typy danych
- Funkcje pomocnicze
- Przykłady

### 3. API
- Opis endpointów
- Format danych
- Obsługa błędów
- Limity i ograniczenia

## 🔍 Debugowanie

### 1. Narzędzia
- React DevTools
- Network panel
- Console
- Sources

### 2. Logi
- Logi aplikacji
- Logi API
- Logi walidacji
- Logi generowania

## 🧪 Testowanie

### 1. Testy jednostkowe
- Komponenty
- Funkcje pomocnicze
- Walidatory

### 2. Testy integracyjne
- API
- DSL
- Motywy

### 3. Testy E2E
- Scenariusze użycia
- Przepływy użytkownika
- Responsywność

## 📦 Zależności

### 1. Główne
- React
- Material-UI
- Monaco Editor
- React Query

### 2. Deweloperskie
- TypeScript
- Jest
- Cypress
- ESLint

## 🤔 FAQ

### 1. Co to jest DSL?
DSL (Domain-Specific Language) to język programowania specjalizowany do konkretnej domeny. W naszym przypadku jest to język do definiowania interfejsów użytkownika.

### 2. Dlaczego TokenDSL?
TokenDSL pozwala na tworzenie aplikacji webowych w sposób token-efektywny, co oznacza, że:
- Wymaga mniej tokenów AI do generowania kodu
- Jest bardziej przewidywalny
- Łatwiejszy w utrzymaniu
- Szybszy w rozwoju

### 3. Jak zacząć?
1. Przejrzyj dokumentację
2. Uruchom demo
3. Wypróbuj DSL Playground
4. Stwórz własny komponent
5. Dostosuj motyw

## 📝 Licencja
MIT 