
export interface CustomElementMetadata {
  tag?: string;
  template?: string;
  templateUrl?: string;
  styleUrl?: string;
  style?: string;
  shadow?: boolean;
}

export const CustomElement = (args: CustomElementMetadata) => {
  return (target) => {
    return target;
  }
}