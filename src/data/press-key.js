/** Stable key for an outlet name, used for logo files and de-duplication. "The Buffalo News" → "buffalonews". */
export const pressKey = (name) => String(name).toLowerCase().replace(/^the\s+/, '').replace(/[^a-z0-9]/g, '');
