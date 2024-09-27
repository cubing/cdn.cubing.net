const warned: Set<string> = new Set();

export function warn(specifier: string): void {
  if (!warned.has(specifier)) {
    console.warn(
      `This page imports code from the following URL: \"https://cdn.cubing.net/js/${specifier}\". To ensure backwards compatibility, please update this to use the \`/v0/\` namespace: \"https://cdn.cubing.net/v0/js/${specifier}\"`,
    );
    warned.add(specifier);
  }
}
