import { parseXML } from './parser';
import { generateFiles } from './generator';
import { ProjectStructure } from './types';
import * as fs from 'fs-extra';
import * as path from 'path';

async function main() {
    try {
        // Read XML file
        const xmlPath = path.resolve(__dirname, '../../../.cursor/structure/index.xml');
        const xmlContent = await fs.readFile(xmlPath, 'utf-8');
        
        // Parse XML to structure
        const structure: ProjectStructure = await parseXML(xmlContent);
        
        // Generate files
        await generateFiles(structure);
        
        console.log('Files generated successfully!');
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main(); 