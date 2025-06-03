export interface GoogleVisionResponse {
  responses: Response[];
}

export interface Response {
  textAnnotations?: TextAnnotation[];
  fullTextAnnotation?: FullTextAnnotation;
  logoAnnotations?: LogoAnnotation[];
}

export interface TextAnnotation {
  locale?: string;
  description: string;
  boundingPoly: BoundingPoly;
}

export interface LogoAnnotation {
  mid: string;
  description: string;
  score: number;
  boundingPoly: BoundingPoly;
}

export interface BoundingPoly {
  vertices: Vertex[];
}

export interface Vertex {
  x: number;
  y: number;
}

export interface FullTextAnnotation {
  pages: Page[];
  text: string;
}

export interface Page {
  property: Property;
  width: number;
  height: number;
  blocks: any[];
}

export interface Property {
  detectedLanguages: DetectedLanguage[];
}

export interface DetectedLanguage {
  languageCode: string;
  confidence: number;
}
