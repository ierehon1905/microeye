export async function t<E = Error, T = unknown>(
    promise: Promise<T>
): Promise<[E, null] | [null, T]> {
    try {
        return [null, await promise];
    } catch (e: any) {
        return [e, null];
    }
}
