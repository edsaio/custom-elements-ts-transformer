import { ObjectLiteralExpression, PropertyAssignment, Identifier } from 'typescript';

export function getClassDecoratorProperty(argument: ObjectLiteralExpression, name: string) {
  return argument.properties.find((property: PropertyAssignment) => {
    return (property.name as Identifier).text === name;
  });
}
