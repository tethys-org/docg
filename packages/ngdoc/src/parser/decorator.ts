import { ts } from '../typescript';
import { ArgumentInfo, NgParsedDecorator } from '../types';
import { lineFeedPrinter } from './line-feed-printer';
import { getNodeText, nodeToString } from './utils';

export function getDecorators(declaration: ts.Declaration): NgParsedDecorator[] {
    if (declaration.decorators) {
        return declaration.decorators.map<NgParsedDecorator>(decorator => {
            const callExpression = getCallExpression(decorator);
            if (callExpression) {
                return {
                    argumentInfo: callExpression.arguments.map(argument => parseArgument(argument)),
                    arguments: callExpression.arguments.map(argument =>
                        lineFeedPrinter.printNode(ts.EmitHint.Expression, argument, declaration.getSourceFile())
                    ),
                    expression: decorator as ts.Decorator,
                    isCallExpression: true,
                    name: nodeToString(callExpression.expression)
                };
            } else {
                return {
                    expression: decorator as ts.Decorator,
                    isCallExpression: false,
                    name: nodeToString(decorator.expression)
                };
            }
        });
    }
}

export function getNgDecorator(
    declaration: ts.Declaration,
    decoratorNames: string[] = ['Component', 'Directive', 'Pipe', 'Injectable']
): NgParsedDecorator {
    const decorators = getDecorators(declaration);
    const decorator = decorators
        ? decorators.find(decorator => {
              return decoratorNames.includes(decorator.name);
          })
        : undefined;
    return decorator;
}

export function getPropertyDecorator(declaration: ts.Declaration) {
    const decorators = getDecorators(declaration);
    const decorator = decorators
        ? decorators.find(decorator => {
              return ['Input', 'Output', 'ContentChild', 'ContentChildren'].includes(decorator.name);
          })
        : undefined;

    if (decorator) {
        const argument: Record<string, string> = decorator.argumentInfo[0] as Record<string, string>;
        return {
            ...decorator,
            ...argument
        };
    }
    return decorator;
}

function getCallExpression(decorator: ts.Decorator) {
    if (decorator.expression.kind === ts.SyntaxKind.CallExpression) {
        return decorator.expression as ts.CallExpression;
    }
}

export function parseProperties(properties: ts.NodeArray<ts.ObjectLiteralElementLike>) {
    const result: ArgumentInfo = {};
    properties.forEach(property => {
        if (property.kind === ts.SyntaxKind.PropertyAssignment) {
            result[nodeToString(property.name!)] = parseArgument((property as ts.PropertyAssignment).initializer);
        }
    });
    return result;
}

export function parseArgument(argument: ts.Expression): ArgumentInfo {
    if (ts.isObjectLiteralExpression(argument)) {
        return parseProperties((argument as ts.ObjectLiteralExpression).properties);
    }
    if (ts.isArrayLiteralExpression(argument)) {
        return (argument as ts.ArrayLiteralExpression).elements.map(element => getNodeText(element));
    }
    return getNodeText(argument);
}
