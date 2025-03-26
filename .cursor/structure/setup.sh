#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Creating TokenDSL project structure...${NC}"

# Create root directories
mkdir -p src/{layers/{presentation,application,domain,infrastructure}/__tests__,core/{parser,validator,generator,runtime,security}/__tests__,modules/{users,posts,comments}/{domain,application/{commands,queries,read-models,write-models,__tests__/{commands,queries}},infrastructure/__tests__,events/__tests__,dependencies,handlers,storage,ui,__tests__},events/__tests__,cqrs/__tests__,shared/{types,utils,constants},docs,monitoring}

# Create root configuration files
touch package.json tsconfig.json jest.config.js README.md docker-compose.yml .env.example

# Create .cursor directory structure
mkdir -p .cursor/team
touch .cursor/{FEAT.md,VISION.01.INTRO.md,VISION.02.USERS.md,VISION.03.DSL.SERVER.md}
touch .cursor/structure/index.xml

# Create test configuration
mkdir -p test
touch test/{jest.config.js,setup.ts,teardown.ts,helpers.ts,mocks.ts}

# Create layers files
for layer in presentation application domain infrastructure; do
    touch src/layers/$layer/{index.ts,controllers.ts,middleware.ts,validation.ts}
    touch src/layers/$layer/__tests__/{controllers.test.ts,middleware.test.ts,validation.test.ts,fixtures.ts}
done

# Create core files
touch src/core/{index.ts,types.ts,errors.ts,config.ts}
for component in parser validator generator runtime security; do
    touch src/core/$component/{index.ts,lexer.ts,ast.ts,visitor.ts,errors.ts}
    touch src/core/$component/__tests__/{lexer.test.ts,ast.test.ts,visitor.test.ts,fixtures.ts}
done

# Create module files
for module in users posts comments; do
    # Domain
    touch src/modules/$module/domain/{${module}.entity.ts,${module}.repository.ts,${module}.service.ts}
    touch src/modules/$module/domain/__tests__/{${module}.entity.test.ts,${module}.repository.test.ts,${module}.service.test.ts,fixtures.ts}
    
    # Application
    touch src/modules/$module/application/commands/{create-${module}.command.ts,update-${module}.command.ts,delete-${module}.command.ts}
    touch src/modules/$module/application/queries/{get-${module}.query.ts,list-${module}s.query.ts}
    touch src/modules/$module/application/read-models/{${module}.read-model.ts,${module}-list.read-model.ts}
    touch src/modules/$module/application/write-models/{${module}.write-model.ts}
    touch src/modules/$module/application/__tests__/commands/{create-${module}.test.ts,update-${module}.test.ts,delete-${module}.test.ts}
    touch src/modules/$module/application/__tests__/queries/{get-${module}.test.ts,list-${module}s.test.ts}
    touch src/modules/$module/application/__tests__/fixtures.ts
    
    # Infrastructure
    touch src/modules/$module/infrastructure/{${module}.repository.impl.ts,${module}.mapper.ts}
    touch src/modules/$module/infrastructure/__tests__/{repository.test.ts,mapper.test.ts,fixtures.ts}
    
    # Events
    touch src/modules/$module/events/{${module}-created.event.ts,${module}-updated.event.ts,${module}-deleted.event.ts,event-handlers.ts}
    touch src/modules/$module/events/__tests__/{event-handlers.test.ts,fixtures.ts}
    
    # Dependencies
    touch src/modules/$module/dependencies/{index.ts,interfaces.ts}
    
    # Main module files
    touch src/modules/$module/{index.dsl.ts,api.ts,schemas.ts}
    
    # Handlers
    touch src/modules/$module/handlers/{create.ts,get.ts,update.ts,delete.ts}
    
    # Storage
    touch src/modules/$module/storage/{memory.ts,database.ts,seed.ts}
    
    # UI
    touch src/modules/$module/ui/{forms.ts,pages.ts,components.ts}
    
    # Module tests
    touch src/modules/$module/__tests__/{integration.test.ts,e2e.test.ts,fixtures.ts}
done

# Create events files
touch src/events/{index.ts,event-store.ts,event-bus.ts,event-handler.ts,event-serializer.ts}
touch src/events/__tests__/{event-store.test.ts,event-bus.test.ts,event-handler.test.ts,event-serializer.test.ts,fixtures.ts}

# Create CQRS files
touch src/cqrs/{index.ts,command-bus.ts,query-bus.ts,command-handler.ts,query-handler.ts}
touch src/cqrs/__tests__/{command-bus.test.ts,query-bus.test.ts,command-handler.test.ts,query-handler.test.ts,fixtures.ts}

# Create shared files
touch src/shared/types/{index.ts,api.ts,ui.ts}
touch src/shared/utils/{index.ts,validation.ts,formatting.ts}
touch src/shared/constants/{index.ts,api.ts,ui.ts}

# Create documentation files
touch src/docs/{api.md,dsl.md,ui.md,examples.md,security.md,testing.md}

# Create monitoring files
touch src/monitoring/{index.ts,metrics.ts,logging.ts,errors.ts}

# Make the script executable
chmod +x setup.sh

echo -e "${GREEN}Project structure created successfully!${NC}"
echo -e "${BLUE}Next steps:${NC}"
echo "1. Initialize git repository: git init"
echo "2. Install dependencies: npm install"
echo "3. Configure TypeScript: npx tsc --init"
echo "4. Configure ESLint: npx eslint --init"
echo "5. Configure Prettier: npx prettier --init" 