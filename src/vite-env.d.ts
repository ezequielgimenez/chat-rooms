/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_apiKey: string;
  readonly VITE_databaseURL: string;
  readonly VITE_dataBaseRTDB: string;
  readonly VITE_projectId: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
