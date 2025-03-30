import { parseString } from 'xml2js';
import { ProjectStructure, Directory, File, Interface, Property, Type } from './types';

export async function parseXML(xmlContent: string): Promise<ProjectStructure> {
    return new Promise((resolve, reject) => {
        parseString(xmlContent, (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            const project = result.project;
            const structure: ProjectStructure = {
                name: project.name[0],
                version: project.version[0],
                directories: parseDirectories(project.directory)
            };

            resolve(structure);
        });
    });
}

function parseDirectories(directories: any[]): Directory[] {
    return directories.map(dir => ({
        name: dir.$.name,
        type: 'directory',
        children: parseChildren(dir)
    }));
}

function parseChildren(children: any[]): (Directory | File)[] {
    if (!children) return [];

    return children.map(child => {
        if (child.directory) {
            return {
                name: child.directory[0].$.name,
                type: 'directory',
                children: parseChildren(child.directory[0])
            };
        }

        if (child.file) {
            const file = child.file[0];
            return {
                name: file.$.name,
                type: 'file',
                content: file._,
                interfaces: parseInterfaces(file.interface),
                types: parseTypes(file.type)
            };
        }

        return null;
    }).filter(Boolean) as (Directory | File)[];
}

function parseInterfaces(interfaces: any[]): Interface[] {
    if (!interfaces) return [];

    return interfaces.map(int => ({
        name: int.$.name,
        properties: parseProperties(int.property)
    }));
}

function parseProperties(properties: any[]): Property[] {
    if (!properties) return [];

    return properties.map(prop => ({
        name: prop.$.name,
        type: prop.$.type,
        optional: prop.$.optional === 'true'
    }));
}

function parseTypes(types: any[]): Type[] {
    if (!types) return [];

    return types.map(type => ({
        name: type.$.name,
        value: type._
    }));
} 