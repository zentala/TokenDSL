#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { TokenDslGenerator } from '../lib/generator';

const program = new Command();

program
  .name('tokendsl')
  .description('CLI for TokenDSL - Token-Efficient Backend DSL')
  .version('0.1.0');

program
  .command('generate')
  .description('Generate code from TokenDSL XML definition')
  .argument('<file>', 'XML file containing TokenDSL definition')
  .option('-o, --output <dir>', 'Output directory', './generated')
  .option('-f, --framework <framework>', 'Backend framework (express, fastify)', 'express')
  .action(async (file, options) => {
    try {
      const generator = new TokenDslGenerator({
        outputDir: options.output,
        templateDir: path.join(__dirname, '../templates'),
        handlerDir: 'handlers',
        middlewareDir: 'middlewares'
      });
      
      console.log(chalk.blue(`Parsing ${file}...`));
      const xmlData = generator.parseXmlFile(file);
      
      console.log(chalk.blue('Generating API code...'));
      const apiCode = generator.generateApiFromXml(xmlData);
      
      // Create output directory if it doesn't exist
      if (!fs.existsSync(options.output)) {
        fs.mkdirSync(options.output, { recursive: true });
      }
      
      // Write API file
      const apiFileName = path.basename(file, '.xml') + '.ts';
      fs.writeFileSync(path.join(options.output, apiFileName), apiCode);
      console.log(chalk.green(`✓ API file generated: ${apiFileName}`));
      
      // Generate and write DSL engine
      const dslDir = path.join(options.output, 'dsl');
      if (!fs.existsSync(dslDir)) {
        fs.mkdirSync(dslDir, { recursive: true });
      }
      
      const engineCode = generator.generateDslEngine();
      fs.writeFileSync(path.join(dslDir, 'engine.ts'), engineCode);
      console.log(chalk.green('✓ DSL engine generated'));
      
      // Generate backend if requested
      if (options.framework) {
        console.log(chalk.blue(`Generating ${options.framework} backend...`));
        const backendCode = generator.generateExpressBackend(apiCode);
        fs.writeFileSync(path.join(options.output, 'index.ts'), backendCode);
        console.log(chalk.green('✓ Backend application generated'));
      }
      
      console.log(chalk.green('\nAll files generated successfully!'));
    } catch (error) {
      console.error(chalk.red('Error generating code:'), error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Initialize a new TokenDSL project')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'tokendsl-project'
      },
      {
        type: 'list',
        name: 'framework',
        message: 'Choose a backend framework:',
        choices: ['express', 'fastify'],
        default: 'express'
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Use TypeScript?',
        default: true
      },
      {
        type: 'confirm',
        name: 'generateExample',
        message: 'Generate example API?',
        default: true
      }
    ]);
    
    const projectDir = answers.projectName;
    
    // Create project directory
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    
    // Create package.json
    const packageJson = {
      name: answers.projectName,
      version: '0.1.0',
      description: 'API built with TokenDSL',
      main: 'dist/index.js',
      scripts: {
        start: answers.typescript ? 'ts-node src/index.ts' : 'node src/index.js',
        build: answers.typescript ? 'tsc' : 'echo "No build step"',
        dev: answers.typescript ? 'nodemon --exec ts-node src/index.ts' : 'nodemon src/index.js',
        generate: 'tokendsl generate'
      },
      dependencies: {
        [answers.framework]: '^latest',
        'zod': '^latest',
        'fast-xml-parser': '^latest'
      },
      devDependencies: answers.typescript ? {
        'typescript': '^latest',
        'ts-node': '^latest',
        'nodemon': '^latest',
        '@types/node': '^latest',
        [`@types/${answers.framework}`]: '^latest'
      } : {
        'nodemon': '^latest'
      }
    };
    
    fs.writeFileSync(
      path.join(projectDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
    
    // Create project structure
    const srcDir = path.join(projectDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'dsl'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'api'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'handlers'), { recursive: true });
    fs.mkdirSync(path.join(srcDir, 'middlewares'), { recursive: true });
    fs.mkdirSync(path.join(projectDir, 'definitions'), { recursive: true });
    
    // Create example files if requested
    if (answers.generateExample) {
      // Create example XML
      const exampleXml = fs.readFileSync(
        path.join(__dirname, '../templates/example.xml'),
        'utf-8'
      );
      fs.writeFileSync(
        path.join(projectDir, 'definitions', 'example.xml'),
        exampleXml
      );
      
      // Create example handler
      const extension = answers.typescript ? 'ts' : 'js';
      const exampleHandler = fs.readFileSync(
        path.join(__dirname, `../templates/example-handler.${extension}`),
        'utf-8'
      );
      fs.writeFileSync(
        path.join(srcDir, 'handlers', `users.${extension}`),
        exampleHandler
      );
    }
    
    // Create README.md
    const readme = `# ${answers.projectName}

API built with TokenDSL - A token-efficient backend DSL for AI-integrated development.

## Getting Started

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Generate code from XML definition
npm run generate -- definitions/example.xml
\`\`\`
`;
    fs.writeFileSync(path.join(projectDir, 'README.md'), readme);
    
    // Create tsconfig.json if TypeScript is selected
    if (answers.typescript) {
      const tsConfig = {
        compilerOptions: {
          target: 'es2020',
          module: 'commonjs',
          esModuleInterop: true,
          outDir: './dist',
          strict: true,
          rootDir: './src'
        },
        include: ['src/**/*'],
        exclude: ['node_modules']
      };
      fs.writeFileSync(
        path.join(projectDir, 'tsconfig.json'),
        JSON.stringify(tsConfig, null, 2)
      );
    }
    
    console.log(chalk.green(`\nProject ${answers.projectName} initialized successfully!`));
    console.log(`
Run the following commands to get started:

  ${chalk.cyan(`cd ${answers.projectName}`)}
  ${chalk.cyan('npm install')}
  ${chalk.cyan('npm run dev')}
    `);
  });

program
  .command('create')
  .description('Create a new TokenDSL API endpoint')
  .argument('<name>', 'Endpoint name (e.g., users/create)')
  .option('-m, --method <method>', 'HTTP method', 'GET')
  .option('-p, --path <path>', 'Endpoint path')
  .action(async (name, options) => {
    const [resource, action] = name.split('/');
    const path = options.path || `/${resource}${action ? `/${action}` : ''}`;
    
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: 'Endpoint description:',
        default: `${options.method} ${path} endpoint`
      },
      {
        type: 'input',
        name: 'tags',
        message: 'Tags (comma separated):',
        default: resource
      },
      {
        type: 'confirm',
        name: 'uiSchema',
        message: 'Generate UI schema?',
        default: true
      }
    ]);
    
    // Create XML template
    const xmlTemplate = `<?xml version="1.0" encoding="UTF-8"?>
<tokenDSL version="1.0">
  <api name="${resource}Api">
    <endpoint method="${options.method}" path="${path}">
      <description>${answers.description}</description>
      <tags>
        ${answers.tags.split(',').map(tag => `<tag>${tag.trim()}</tag>`).join('\n        ')}
      </tags>
      <input>
        <schema>
          <object>
            <!-- Define input properties here -->
            <property name="example" type="string" description="Example property" />
          </object>
        </schema>
      </input>
      <handler file="handlers/${resource}.ts" function="${action || 'getAll'}${resource.charAt(0).toUpperCase() + resource.slice(1)}" />
      ${answers.uiSchema ? `<uiSchema>
        <layout>${action === 'create' || action === 'update' ? 'form' : 'card'}</layout>
        <fields>
          <field name="example">
            <type>text</type>
            <label>Example field</label>
          </field>
        </fields>
      </uiSchema>` : ''}
      <commitHint>Add ${resource} ${action} endpoint</commitHint>
    </endpoint>
  </api>
</tokenDSL>`;

    const definitionsDir = './definitions';
    if (!fs.existsSync(definitionsDir)) {
      fs.mkdirSync(definitionsDir, { recursive: true });
    }
    
    const fileName = `${resource}-${action || 'main'}.xml`;
    fs.writeFileSync(path.join(definitionsDir, fileName), xmlTemplate);
    
    console.log(chalk.green(`\nEndpoint definition created: ${fileName}`));
    console.log(`
To generate code from this definition, run:

  ${chalk.cyan(`tokendsl generate ${path.join(definitionsDir, fileName)}`)}
    `);
  });

program.parse();