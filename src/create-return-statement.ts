import { createNoSubstitutionTemplateLiteral, createReturn, NoSubstitutionTemplateLiteral, Expression } from 'typescript';

export function createReturnStatement(initializer: Expression) {
  const text = (initializer as NoSubstitutionTemplateLiteral).text;
  return createReturn(createNoSubstitutionTemplateLiteral(text));
}