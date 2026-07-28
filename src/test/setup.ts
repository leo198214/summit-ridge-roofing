import '@testing-library/jest-dom/vitest'

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: () => ({ drawImage: () => undefined }),
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
})
