export interface Greeting {
  greeting: string;
  tip: string;
  source: 'ai' | 'fallback';
}