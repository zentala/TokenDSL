super, czuy taki dsl bedzie jednozczaczy? ew czy mozna  npisac struktue xml ktora pozwoli jednoznaczne naszej blbioekce wygenrowac z niej taki backend w locie?Rozumiem, że pytasz o jednoznaczność DSL i możliwość reprezentacji w XML, która pozwoliłaby na automatyczne generowanie backendu.
TokenDSL w obecnej formie jest już dość jednoznaczny dzięki silnemu typowaniu TypeScript i Zod. Jednak faktycznie można go jeszcze bardziej ustrukturyzować poprzez format XML, który byłby łatwiej przetwarzany przez narzędzia zewnętrzne i bardziej jednoznaczny dla różnych systemów.
Oto propozycja struktury XML dla TokenDSL:

---

<?xml version="1.0" encoding="UTF-8"?>
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
      <output>
        <schema>
          <object>
            <property name="id" type="string" description="User ID" />
            <property name="name" type="string" description="Full name of the user" />
            <property name="email" type="string" format="email" description="Email used for login" />
          </object>
        </schema>
      </output>
      <handler file="handlers/users.ts" function="getUserById" />
      <middleware>
        <apply>authMiddleware</apply>
        <apply>logMiddleware</apply>
      </middleware>
      <statusCodes>
        <code value="200">Success</code>
        <code value="404">User not found</code>
        <code value="500">Internal server error</code>
      </statusCodes>
      <examples>
        <example type="output">
          <value><![CDATA[{ "id": "123", "name": "Alice", "email": "alice@example.com" }]]></value>
        </example>
      </examples>
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
      <docs>
        <summary>Fetch a specific user</summary>
        <description>Retrieves user details by their unique identifier</description>
      </docs>
      <commitHint>Add user fetch endpoint</commitHint>
    </endpoint>
    <endpoint method="POST" path="/users">
      <description>Create a new user</description>
      <tags>
        <tag>users</tag>
        <tag>create</tag>
      </tags>
      <input>
        <schema>
          <object>
            <property name="name" type="string" description="Full name of the user" />
            <property name="email" type="string" format="email" description="Email used for login" />
          </object>
        </schema>
      </input>
      <output>
        <schema>
          <object>
            <property name="id" type="string" description="User ID" />
            <property name="name" type="string" description="Full name of the user" />
            <property name="email" type="string" format="email" description="Email used for login" />
          </object>
        </schema>
      </output>
      <handler file="handlers/users.ts" function="createUser" />
      <examples>
        <example type="input">
          <value><![CDATA[{ "name": "Alice", "email": "alice@example.com" }]]></value>
        </example>
      </examples>
      <uiSchema>
        <layout>form</layout>
        <formOptions>
          <submitText>Create User</submitText>
          <cancelText>Cancel</cancelText>
        </formOptions>
        <fields>
          <field name="name">
            <type>text</type>
            <label>Full name</label>
            <required>true</required>
            <helperText>Enter your full legal name</helperText>
            <validationRules>
              <minLength>2</minLength>
              <maxLength>50</maxLength>
            </validationRules>
          </field>
          <field name="email">
            <type>email</type>
            <label>Email address</label>
            <required>true</required>
          </field>
        </fields>
      </uiSchema>
      <tests>
        <test>
          <input><![CDATA[{ "name": "Alice", "email": "alice@example.com" }]]></input>
          <expected><![CDATA[{ "success": true }]]></expected>
        </test>
        <test>
          <input><![CDATA[{ "name": "", "email": "invalid" }]]></input>
          <expected><![CDATA[{ "error": true }]]></expected>
        </test>
      </tests>
      <commitHint>Add user creation endpoint</commitHint>
    </endpoint>
  </api>
</tokenDSL>


Taka struktura XML jest bardziej jednoznaczna i pozwala na automatyczne generowanie backendu. Aby zaimplementować bibliotekę, która może generować backend w locie z takiego XML, proponuję następujący schemat:

import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { Express } from 'express';
import * as z from 'zod';

interface TokenDslConfig {
  outputDir: string;
  templateDir: string;
  handlerDir: string;
  middlewareDir: string;
}

class TokenDslGenerator {
  private config: TokenDslConfig;
  private parser: XMLParser;

  constructor(config: TokenDslConfig) {
    this.config = config;
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '_',
      isArray: (name) => ['tag', 'property', 'code', 'example', 'field', 'test', 'apply'].includes(name),
    });
  }
  
  // Parsowanie pliku XML do struktury JS
  parseXmlFile(filePath: string) {
    const xmlContent = fs.readFileSync(filePath, 'utf-8');
    return this.parser.parse(xmlContent);
  }
  
  // Generowanie schematu Zod z definicji XML
  generateZodSchema(schemaDefinition: any): string {
    if (schemaDefinition.object) {
      const properties = schemaDefinition.object.property;
      const lines = properties.map((prop: any) => {
        let propCode = `${prop._name}: z.${prop._type}()`;
        
        if (prop._format === 'email') {
          propCode = `${prop._name}: z.string().email()`;
        }
        
        if (prop._description) {
          propCode += `.describe('${prop._description}')`;
        }
        
        return propCode;
      });
      
      return `z.object({\n  ${lines.join(',\n  ')}\n})`;
    }
    
    return 'z.any()';
  }
  
  // Generowanie importów handlerów
  generateHandlerImports(endpoints: any[]): string {
    const handlerFiles = new Set<string>();
    const handlers = new Set<string>();
    
    endpoints.forEach(endpoint => {
      const handlerFile = endpoint.handler._file;
      const handlerFunc = endpoint.handler._function;
      handlerFiles.add(handlerFile);
      handlers.add(handlerFunc);
    });
    
    return Array.from(handlerFiles).map(file => {
      const importedHandlers = Array.from(handlers).join(', ');
      return `import { ${importedHandlers} } from '../${file}';`;
    }).join('\n');
  }
  
  // Generowanie kodu dla endpointu
  generateEndpointCode(endpoint: any): string {
    const method = endpoint._method;
    const path = endpoint._path;
    const handlerFunc = endpoint.handler._function;
    
    const inputSchema = endpoint.input ? 
      this.generateZodSchema(endpoint.input.schema) : 
      'z.object({})';
    
    const outputSchema = endpoint.o ? 
      this.generateZodSchema(endpoint.o.schema) : 
      null;
    
    const tagsArray = endpoint.tags && endpoint.tags.tag ? 
      `[${endpoint.tags.tag.map((t: any) => `'${t}'`).join(', ')}]` : 
      '[]';
    
    let uiSchemaCode = 'undefined';
    if (endpoint.uiSchema) {
      const fields = endpoint.uiSchema.fields.field.map((field: any) => {
        return `${field._name}: { 
          type: '${field.type}', 
          label: '${field.label}'${field.display ? `, display: '${field.display}'` : ''}${field.required ? `, required: ${field.required}` : ''}${field.helperText ? `, helperText: '${field.helperText}'` : ''}
        }`;
      }).join(',\n        ');
      
      uiSchemaCode = `{
      layout: '${endpoint.uiSchema.layout}',
      ${endpoint.uiSchema.formOptions ? `formOptions: {
        submitText: '${endpoint.uiSchema.formOptions.submitText || 'Submit'}',
        cancelText: '${endpoint.uiSchema.formOptions.cancelText || 'Cancel'}'
      },` : ''}
      fields: {
        ${fields}
      }
    }`;
    }
    
    let exampleCode = '';
    if (endpoint.examples && endpoint.examples.example) {
      const examples = endpoint.examples.example.map((ex: any) => {
        return `${ex._type}Example: ${ex.value}`;
      }).join(',\n    ');
      
      if (examples) {
        exampleCode = `,\n    ${examples}`;
      }
    }
    
    return `  '${method} ${path}': {
    input: ${inputSchema},
    ${outputSchema ? `output: ${outputSchema},` : ''}
    handler: ${handlerFunc},
    description: '${endpoint.description || ''}',
    tags: ${tagsArray},
    ${endpoint.middleware ? `middleware: [${endpoint.middleware.apply.map((m: any) => m).join(', ')}],` : ''}
    ${endpoint.statusCodes ? `statusCodes: {
      ${endpoint.statusCodes.code.map((c: any) => `${c._value}: '${c}'`).join(',\n      ')}
    },` : ''}
    uiSchema: ${uiSchemaCode}${exampleCode}
    ${endpoint.commitHint ? `,\n    commitHint: '${endpoint.commitHint}'` : ''}
  }`;
  }
  
  // Generowanie kodu całego API z XML
  generateApiFromXml(xmlData: any): string {
    const api = xmlData.tokenDSL.api;
    const apiName = api._name;
    const endpoints = Array.isArray(api.endpoint) ? api.endpoint : [api.endpoint];
    
    const importsCode = this.generateHandlerImports(endpoints);
    const endpointsCode = endpoints.map(endpoint => this.generateEndpointCode(endpoint)).join(',\n\n');
    
    return `import { z } from 'zod';
import { defineApi } from '../dsl/engine';
${importsCode}

export const ${apiName} = defineApi({
  ${api._prefix ? `prefix: '${api._prefix}',` : ''}
${endpointsCode}
});
`;
  }
  
  // Generowanie backendu Express z definicji API
  generateExpressBackend(apiCode: string): string {
    return `import express from 'express';
import bodyParser from 'body-parser';
import { applyApi } from './dsl/engine';
${apiCode.split('export ')[0]}

const app = express();
app.use(bodyParser.json());

// Apply API definitions
const ${apiCode.match(/export const (\w+)/)?.[1]} = ${apiCode.split('export const ')[1]};
applyApi(app, ${apiCode.match(/export const (\w+)/)?.[1]});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
`;
  }
  
  // Generowanie silnika DSL
  generateDslEngine(): string {
    return `import { z } from 'zod';
import { Express, Request, Response } from 'express';

export type Handler<T = any, R = any> = (data: T, req: Request) => Promise<R> | R;

export interface EndpointDefinition<T = any, R = any> {
  input?: z.ZodType<T>;
  output?: z.ZodType<R>;
  handler: Handler<T, R>;
  description?: string;
  tags?: string[];
  middleware?: Array<(req: Request, res: Response, next: Function) => void>;
  statusCodes?: Record<number, string>;
  uiSchema?: UISchema;
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

export type ApiDefinition = Record<string, EndpointDefinition>;

export function defineApi(definition: ApiDefinition): ApiDefinition {
  return definition;
}

export function applyApi(app: Express, api: ApiDefinition): void {
  for (const [routeKey, def] of Object.entries(api)) {
    const [method, path] = routeKey.split(' ');
    const handler = def.handler;
    const inputSchema = def.input;
    const outputSchema = def.output;
    const middleware = def.middleware || [];
    
    app[method.toLowerCase()](path, ...middleware, async (req: Request, res: Response) => {
      try {
        // Combine parameters from different sources
        const rawData = {
          ...req.params,
          