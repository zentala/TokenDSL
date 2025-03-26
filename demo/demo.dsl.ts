import { defineFrontend } from '@tokendsl/core';

export const demoApp = defineFrontend({
  name: 'TokenDSL Demo',
  version: '1.0.0',
  template: 'react-v1',
  
  // Theme configuration
  theme: {
    primary: '#4F46E5',
    secondary: '#10B981',
    dark: true
  },

  // Layout configuration
  layout: {
    type: 'DemoLayout',
    sidebar: {
      position: 'left',
      width: 280,
      collapsible: true
    }
  },

  // Pages configuration
  pages: {
    home: {
      path: '/',
      layout: 'grid',
      components: {
        welcome: {
          type: 'Hero',
          title: 'Welcome to TokenDSL',
          subtitle: 'Interactive Demo & Documentation',
          actions: [
            { label: 'Get Started', href: '/playground' },
            { label: 'View Components', href: '/components' }
          ]
        },
        features: {
          type: 'FeatureGrid',
          items: [
            {
              title: 'DSL Playground',
              description: 'Interactive DSL editor with live preview',
              icon: 'code'
            },
            {
              title: 'Component Gallery',
              description: 'Browse and test all available components',
              icon: 'palette'
            },
            {
              title: 'Model Builder',
              description: 'Visual model definition interface',
              icon: 'database'
            }
          ]
        }
      }
    },

    components: {
      path: '/components',
      layout: 'split',
      components: {
        sidebar: {
          type: 'ComponentNav',
          categories: ['basic', 'form', 'layout', 'data']
        },
        content: {
          type: 'ComponentGallery',
          showCode: true,
          showProps: true,
          showExamples: true
        }
      }
    },

    playground: {
      path: '/playground',
      layout: 'split',
      components: {
        editor: {
          type: 'DSLPlayground',
          features: ['syntax', 'autocomplete', 'validation', 'preview']
        },
        modelBuilder: {
          type: 'ModelBuilder',
          features: ['drag-drop', 'validation', 'relationships']
        }
      }
    }
  },

  // Global components configuration
  components: {
    // Basic components
    Button: {
      variants: ['primary', 'secondary', 'outline', 'ghost'],
      sizes: ['sm', 'md', 'lg']
    },
    Input: {
      types: ['text', 'number', 'email', 'password'],
      states: ['default', 'error', 'success']
    },
    Card: {
      variants: ['default', 'bordered', 'elevated']
    },

    // Form components
    Form: {
      features: ['validation', 'auto-save', 'reset']
    },
    Select: {
      features: ['search', 'multi', 'clearable']
    },
    Checkbox: {
      features: ['indeterminate', 'group']
    },

    // Layout components
    Grid: {
      features: ['responsive', 'gutter', 'alignment']
    },
    Stack: {
      features: ['spacing', 'alignment', 'wrap']
    },
    Modal: {
      features: ['backdrop', 'keyboard', 'animation']
    },

    // Data components
    Table: {
      features: ['sorting', 'filtering', 'pagination']
    },
    Chart: {
      types: ['line', 'bar', 'pie', 'scatter']
    },
    Calendar: {
      features: ['events', 'range', 'multi-select']
    }
  }
}); 