import * as ts from 'typescript';
import { TransformerFactory } from './transformers/transformer-factory';

const transformers = [
  "update-class",
  "import-custom-html-element",
  "extends-class",
  "toggle-decorator"
]

export function transformer() {
  return transformers.map(transformer => {
    const  Transformer = require(`./transformers/${transformer}`).default;
    return (new Transformer() as TransformerFactory<ts.SourceFile>).factory();
  });
}