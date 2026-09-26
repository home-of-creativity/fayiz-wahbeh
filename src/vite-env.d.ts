/// <reference types="vite/client" />

declare module '*?responsive' {
  const image: import('./types').ResponsiveImage;
  export default image;
}

declare module '*?texture' {
  const src: string;
  export default src;
}
