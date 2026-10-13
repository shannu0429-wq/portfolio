/// <reference types="vite/client" />

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'canvas-confetti' {
  const confetti: any;
  export default confetti;
}
