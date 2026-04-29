/// <reference types="vite/client" />

declare module '*.xlsx' {
  const data: Record<string, any[][]>;
  export default data;
}
declare module '*.xls' {
  const data: Record<string, any[][]>;
  export default data;
}
