export interface ProjectStructure {
    name: string;
    version: string;
    directories: Directory[];
}

export interface Directory {
    name: string;
    type: 'directory' | 'file';
    content?: string;
    children?: (Directory | File)[];
}

export interface File {
    name: string;
    type: 'file';
    content?: string;
    interfaces?: Interface[];
    types?: Type[];
}

export interface Interface {
    name: string;
    properties: Property[];
}

export interface Property {
    name: string;
    type: string;
    optional?: boolean;
}

export interface Type {
    name: string;
    value: string;
} 