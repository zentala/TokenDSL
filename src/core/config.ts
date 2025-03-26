/**
 * Configuration system for TokenDSL
 */

import { z } from 'zod';

// Configuration schema
const ConfigSchema = z.object({
  // Server configuration
  server: z.object({
    port: z.number().default(3000),
    host: z.string().default('localhost'),
    cors: z.boolean().default(true),
    corsOptions: z.object({
      origin: z.string().optional(),
      methods: z.array(z.string()).optional(),
      allowedHeaders: z.array(z.string()).optional(),
    }).optional(),
  }),
  
  // DSL configuration
  dsl: z.object({
    inputDir: z.string().default('src/modules'),
    outputDir: z.string().default('dist'),
    tempDir: z.string().default('.temp'),
    watch: z.boolean().default(false),
  }),
  
  // Storage configuration
  storage: z.object({
    type: z.enum(['memory', 'database']).default('memory'),
    database: z.object({
      type: z.enum(['postgres', 'mysql', 'sqlite']).optional(),
      host: z.string().optional(),
      port: z.number().optional(),
      username: z.string().optional(),
      password: z.string().optional(),
      database: z.string().optional(),
    }).optional(),
  }),
  
  // Security configuration
  security: z.object({
    jwt: z.object({
      secret: z.string(),
      expiresIn: z.string().default('1h'),
    }).optional(),
    cors: z.boolean().default(true),
  }),
  
  // Monitoring configuration
  monitoring: z.object({
    metrics: z.boolean().default(true),
    logging: z.boolean().default(true),
    errorTracking: z.boolean().default(true),
  }),
  
  // UI configuration
  ui: z.object({
    theme: z.string().default('default'),
    components: z.record(z.any()).optional(),
  }),
});

// Configuration type
export type Config = z.infer<typeof ConfigSchema>;

// Default configuration
export const defaultConfig: Config = {
  server: {
    port: 3000,
    host: 'localhost',
    cors: true,
  },
  dsl: {
    inputDir: 'src/modules',
    outputDir: 'dist',
    tempDir: '.temp',
    watch: false,
  },
  storage: {
    type: 'memory',
  },
  security: {
    cors: true,
  },
  monitoring: {
    metrics: true,
    logging: true,
    errorTracking: true,
  },
  ui: {
    theme: 'default',
  },
};

// Configuration manager
export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;
  
  private constructor() {
    this.config = defaultConfig;
  }
  
  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }
  
  // Load configuration from file
  async loadFromFile(path: string): Promise<void> {
    try {
      const config = await import(path);
      this.validateAndMerge(config);
    } catch (error) {
      console.error('Failed to load configuration:', error);
      throw error;
    }
  }
  
  // Load configuration from environment
  loadFromEnv(): void {
    const envConfig = {
      server: {
        port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
        host: process.env.HOST,
        cors: process.env.CORS === 'true',
      },
      dsl: {
        inputDir: process.env.DSL_INPUT_DIR,
        outputDir: process.env.DSL_OUTPUT_DIR,
        tempDir: process.env.DSL_TEMP_DIR,
        watch: process.env.DSL_WATCH === 'true',
      },
      storage: {
        type: process.env.STORAGE_TYPE as 'memory' | 'database',
        database: {
          type: process.env.DB_TYPE as 'postgres' | 'mysql' | 'sqlite',
          host: process.env.DB_HOST,
          port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_DATABASE,
        },
      },
      security: {
        jwt: {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
        cors: process.env.CORS === 'true',
      },
      monitoring: {
        metrics: process.env.METRICS === 'true',
        logging: process.env.LOGGING === 'true',
        errorTracking: process.env.ERROR_TRACKING === 'true',
      },
      ui: {
        theme: process.env.UI_THEME,
      },
    };
    
    this.validateAndMerge(envConfig);
  }
  
  // Get current configuration
  getConfig(): Config {
    return this.config;
  }
  
  // Update configuration
  updateConfig(partial: Partial<Config>): void {
    this.validateAndMerge(partial);
  }
  
  // Validate and merge configuration
  private validateAndMerge(partial: Partial<Config>): void {
    try {
      const validated = ConfigSchema.parse({
        ...this.config,
        ...partial,
      });
      this.config = validated;
    } catch (error) {
      console.error('Invalid configuration:', error);
      throw error;
    }
  }
} 