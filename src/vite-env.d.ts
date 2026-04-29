/// <reference types="vite/client" />

declare module '*.xlsx' {
  const data: Record<string, any[][]>;
  export default data;
}
declare module '*.xls' {
  const data: Record<string, any[][]>;
  export default data;
}
// Le package n'expose pas de types pour son entrée CSS — déclaration manuelle.
declare module '@engie-group/fluid-design-system-react/css' {}
