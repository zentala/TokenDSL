import * as fs from 'fs-extra';
import * as path from 'path';
import { ProjectStructure, Directory, File } from './types';

export async function generateFiles(structure: ProjectStructure): Promise<void> {
    const baseDir = path.resolve(__dirname, '../../../');
    
    for (const dir of structure.directories) {
        await generateDirectory(dir, baseDir);
    }
}

async function generateDirectory(dir: Directory, basePath: string): Promise<void> {
    const dirPath = path.join(basePath, dir.name);
    
    // Create directory
    await fs.ensureDir(dirPath);
    
    if (dir.children) {
        for (const child of dir.children) {
            if (child.type === 'directory') {
                await generateDirectory(child as Directory, dirPath);
            } else {
                await generateFile(child as File, dirPath);
            }
        }
    }
}

async function generateFile(file: File, basePath: string): Promise<void> {
    const filePath = path.join(basePath, file.name);
    let content = '';

    // Generate TypeScript content
    if (file.interfaces) {
        content += generateInterfaces(file.interfaces);
    }
    if (file.types) {
        content += generateTypes(file.types);
    }
    if (file.content) {
        content += file.content;
    }

    // Write file
    await fs.writeFile(filePath, content, 'utf-8');
}

function generateInterfaces(interfaces: any[]): string {
    return interfaces.map(int => `
export interface ${int.name} {
    ${int.properties.map(prop => 
        `${prop.name}${prop.optional ? '?' : ''}: ${prop.type};`
    ).join('\n    ')}
}
`).join('\n');
}

function generateTypes(types: any[]): string {
    return types.map(type => `
export type ${type.name} = ${type.value};
`).join('\n');
} 