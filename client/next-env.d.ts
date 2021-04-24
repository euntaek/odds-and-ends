/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="@emotion/react/types/css-prop" />

declare namespace NodeJS {
  interface ProcessEnv {
    API_ENDPOINT: string;
  }
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}
