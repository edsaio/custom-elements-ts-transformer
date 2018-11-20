import * as ts from 'typescript';

export interface Transformer<T extends ts.SourceFile | ts.Node> {
  factory(): ts.TransformerFactory<T>;
  transform(context: ts.TransformationContext, source: T): T;
}

export abstract class TransformerFactory<T extends ts.SourceFile | ts.Node> implements Transformer<T> {
  
  factory(): ts.TransformerFactory<T> {
    return (context) => (source: T) => this.transform(context, source);
  }
  
  abstract transform(context: ts.TransformationContext, source: T): T;
} 