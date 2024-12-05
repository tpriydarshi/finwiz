/// <reference types="@testing-library/jest-dom" />
/// <reference types="vitest" />

interface ResizeObserverEntry {
  readonly target: Element;
  readonly contentRect: DOMRectReadOnly;
  readonly borderBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly contentBoxSize: ReadonlyArray<ResizeObserverSize>;
  readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
}

interface ResizeObserverSize {
  readonly inlineSize: number;
  readonly blockSize: number;
}

interface ResizeObserverConstructor {
  new (callback: ResizeObserverCallback): ResizeObserver;
  prototype: ResizeObserver;
}

type ResizeObserverCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

interface ResizeObserver {
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
  disconnect(): void;
}

interface ResizeObserverOptions {
  box?: 'content-box' | 'border-box' | 'device-pixel-content-box';
}
