// Stub HTMLCanvasElement.prototype.getContext in jsdom so particle tests do not emit "Not implemented" warnings
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = (() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;
}
