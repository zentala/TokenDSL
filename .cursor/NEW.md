✅ Czy eksportować jako TranscriptModel, czy po prostu model, endpoints?
🔹 Najlepsza praktyka:
Eksportuj jako generyczne nazwy:

ts
Kopiuj
Edytuj
export const model = defineModel({...})
export const endpoints = defineEndpoints({...})
export const prompts = definePrompt({...})
export const ui = defineUISchema({...})
📌 Dlaczego?
Dzięki temu TokenDSL może zaczytywać te wartości automatycznie, bez analizowania nazw:

ts
Kopiuj
Edytuj
const feature = await import('./features/transcription-v1/index.ts');
registry.addFeature(feature); // wie co to jest
To pozwala później traktować każdy DSL jako plugin typu:

ts
Kopiuj
Edytuj
export interface DSLFeature {
  model?: ModelDef;
  endpoints?: EndpointDef;
  prompts?: PromptDef;
  ui?: UISchema;
}


---

🧩 Jak TokenDSL „włącza” DSL do systemu?
1. Struktura transcription.dsl.ts
ts
Kopiuj
Edytuj
// features/transcription-v1/index.ts
export const model = defineModel({...});
export const endpoints = defineEndpoints({...});
export const prompts = definePrompt({...});
export const ui = defineUISchema({...});
2. TokenDSL główny „loader DSL”:
ts
Kopiuj
Edytuj
// dsl/registry.ts
import * as transcription from './features/transcription-v1';

export const registry = defineDSLRegistry({
  features: {
    'transcription-v1': transcription,
  }
});
Albo dynamicznie:

ts
Kopiuj
Edytuj
// w tokendsl CLI
const features = await loadFeaturesFrom('dsl/features');
features.forEach(f => registry.addFeature(f));
3. Potem tokendsl generate robi:
ts
Kopiuj
Edytuj
// intermediate/transcription-v1/schema.ts
export const schema = z.object({...})

// intermediate/transcription-v1/router.ts
export const router = createRouter({...})

// intermediate/transcription-v1/form.tsx
export function FormComponent() { ... }


---


// transcription.dsl.ts
import { defineModel, defineEndpoints, definePrompt, defineUISchema } from '@tokendsl/core';
import { z } from 'zod';

export const model = defineModel({
  name: 'Transcript',
  schema: z.object({
    id: z.string().uuid(),
    sessionId: z.string().uuid(),
    language: z.string(),
    lines: z.array(z.object({
      start: z.number(),
      end: z.number(),
      speaker: z.string().optional(),
      text: z.string(),
      confidence: z.number().min(0).max(1).optional(),
      emotion: z.enum(['neutral', 'happy', 'sad', 'angry']).optional()
    })),
    summary: z.string().optional(),
    tags: z.array(z.string()).optional(),
    autoTitle: z.string().optional(),
    processing: z.object({
      isSummarizing: z.boolean(),
      isTagging: z.boolean(),
      isTitling: z.boolean(),
      error: z.string().optional()
    })
  })
});

export const endpoints = defineEndpoints({
  'POST /transcription/summarize': {
    description: 'Generuj streszczenie transkryptu',
    input: z.object({ sessionId: z.string().uuid() }),
    output: z.object({ summary: z.string() }),
    handler: 'handlers/transcription/summarize',
    adapters: {
      trpc: true,
      graphql: { mutation: 'summarizeTranscript' }
    }
  }
});

export const prompts = definePrompt({
  id: 'transcription-summary',
  provider: 'openai:gpt-4',
  input: z.object({
    lines: z.array(z.string())
  }),
  template: ({ lines }) => `Streszcz następujące zdania:\n${lines.join('\n')}`,
  output: z.object({ summary: z.string() })
});

export const ui = defineUISchema({
  layout: 'vertical',
  fields: [
    { name: 'language', type: 'select', label: 'Język', options: ['pl', 'en'] },
    { name: 'summary', type: 'textarea', label: 'Streszczenie', readonly: true },
    { name: 'tags', type: 'tags', label: 'Tagi' },
    { name: 'autoTitle', type: 'text', label: 'Sugerowany tytuł', readonly: true }
  ]
});

