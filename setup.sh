#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to create directory and log
create_dir() {
    mkdir -p "$1"
    echo -e "${BLUE}Created directory:${NC} $1"
}

# Function to create file and log
create_file() {
    touch "$1"
    echo -e "${GREEN}Created file:${NC} $1"
}

# Create XML parser utility structure
create_dir "utils/xml-parser"
create_file "utils/xml-parser/package.json"
create_file "utils/xml-parser/tsconfig.json"
create_file "utils/xml-parser/src/index.ts"
create_file "utils/xml-parser/src/parser.ts"
create_file "utils/xml-parser/src/generator.ts"
create_file "utils/xml-parser/src/types.ts"
create_file "utils/xml-parser/src/utils.ts"
create_file "utils/xml-parser/README.md"

# Create src directory structure
create_dir "src/types/core"
create_dir "src/types/models"
create_dir "src/types/dsl"
create_dir "src/types/domain"
create_dir "src/types/application"
create_dir "src/types/infrastructure"
create_dir "src/types/ui"
create_dir "src/types/shared"

# Create core type files
create_file "src/types/core/index.ts"
create_file "src/types/core/api.ts"
create_file "src/types/core/config.ts"
create_file "src/types/core/errors.ts"

# Create model type files
create_file "src/types/models/index.ts"
create_file "src/types/models/user.ts"
create_file "src/types/models/order.ts"
create_file "src/types/models/product.ts"
create_file "src/types/models/common.ts"
create_file "src/types/models/filters.ts"
create_file "src/types/models/sorts.ts"
create_file "src/types/models/pagination.ts"
create_file "src/types/models/validation.ts"
create_file "src/types/models/responses.ts"

# Create DSL type files
create_dir "src/dsl/users-service-v1.0/models"
create_dir "src/dsl/users-service-v1.0/endpoints"
create_dir "src/dsl/users-service-v1.0/i18n"
create_dir "src/dsl/users-service-v1.0/test-data"

create_dir "src/dsl/orders-service-v2.0/models"
create_dir "src/dsl/orders-service-v2.0/endpoints"
create_dir "src/dsl/orders-service-v2.0/i18n"
create_dir "src/dsl/orders-service-v2.0/test-data"

create_dir "src/dsl/common/models"
create_dir "src/dsl/common/middlewares"
create_dir "src/dsl/common/validators"

# Create DSL files
create_file "src/dsl/users-service-v1.0/index.dsl.ts"
create_file "src/dsl/users-service-v1.0/service.config.dsl.ts"
create_file "src/dsl/users-service-v1.0/models/user.model.dsl.ts"
create_file "src/dsl/users-service-v1.0/models/role.model.dsl.ts"
create_file "src/dsl/users-service-v1.0/endpoints/users.endpoints.dsl.ts"
create_file "src/dsl/users-service-v1.0/endpoints/auth.endpoints.dsl.ts"
create_file "src/dsl/users-service-v1.0/i18n/en.mo"
create_file "src/dsl/users-service-v1.0/i18n/pl.mo"
create_file "src/dsl/users-service-v1.0/i18n/i18n.dsl.ts"
create_file "src/dsl/users-service-v1.0/test-data/users.data.json"
create_file "src/dsl/users-service-v1.0/test-data/roles.data.json"

# Create layers structure
create_dir "src/layers/presentation/__tests__"
create_dir "src/layers/application/__tests__"
create_dir "src/layers/domain/__tests__"
create_dir "src/layers/infrastructure/__tests__"

# Create core DSL system structure
create_dir "src/core/parser/__tests__"
create_dir "src/core/validator/__tests__"
create_dir "src/core/generator/__tests__"
create_dir "src/core/runtime"
create_dir "src/core/security"

# Create modules structure
for module in users posts comments; do
    create_dir "src/modules/$module/domain/__tests__"
    create_dir "src/modules/$module/application/commands"
    create_dir "src/modules/$module/application/queries"
    create_dir "src/modules/$module/application/read-models"
    create_dir "src/modules/$module/application/write-models"
    create_dir "src/modules/$module/application/__tests__/commands"
    create_dir "src/modules/$module/application/__tests__/queries"
    create_dir "src/modules/$module/infrastructure/__tests__"
    create_dir "src/modules/$module/events/__tests__"
    create_dir "src/modules/$module/dependencies"
    create_dir "src/modules/$module/handlers"
    create_dir "src/modules/$module/storage"
    create_dir "src/modules/$module/ui"
    create_dir "src/modules/$module/__tests__"
done

# Create shared components structure
create_dir "src/shared/types"
create_dir "src/shared/utils"
create_dir "src/shared/constants"

# Create documentation structure
create_dir "src/docs/guides"

# Create monitoring structure
create_dir "src/monitoring/handlers"

# Create test configuration structure
create_dir "test/fixtures"

# Create root configuration files
touch "package.json"
touch "tsconfig.json"
touch "jest.config.js"
touch "README.md"
touch "docker-compose.yml"
touch ".env.example"

# Create development tools structure
create_dir ".cursor/structure"

# Make the script executable
chmod +x setup.sh

echo -e "${GREEN}Setup completed successfully!${NC}" 