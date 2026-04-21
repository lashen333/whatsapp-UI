export type AnyRecord = Record<string, unknown>;

export function asRecord(value: unknown): AnyRecord | null {
    return typeof value === "object" && value !== null ? (value as AnyRecord) : null;
}

export function getString(value: unknown): string {
    return typeof value === "string" ? value : "";
}

export function getBooleanString(value: unknown): string {
    return typeof value === "boolean" ? String(value) : "";
}

export function getNumberString(value: unknown): string {
    return typeof value === "number" ? String(value) : "";
}

export function getUnknownAsJson(value: unknown): string {
    return JSON.stringify(value);
}