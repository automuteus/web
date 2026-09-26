/** Fetching stats documents the API may still be building.
 *
 * The API gives a large server's rollup longer than one request: a request that outlasts its deadline answers 503
 * with a Retry-After while the build carries on and lands in the cache for the next request. So a 503 here means
 * "not yet", and the page keeps asking on the API's schedule until the document arrives, the API gives up on the
 * build (any other status), or the visitor leaves. */

/** Retry-After bounds in milliseconds. A stray header can then neither hammer the API nor stall the page. */
const MIN_DELAY = 2_000;
const MAX_DELAY = 15_000;
const DEFAULT_DELAY = 5_000;

/** How long to keep retrying in total. The API's own build budget is two minutes (DefaultStatsBuildTimeout), after
 * which a retry fails outright rather than answering 503 again, so waiting much longer only delays a known error. */
export const BUILD_WAIT_BUDGET = 150_000;

export type BuildingFetchOptions = {
    signal: AbortSignal;
    /** Called before each wait, with the time spent so far, so the page can say a build is under way. */
    onWaiting?: (elapsedMs: number) => void;
    /** Total retry budget in milliseconds; defaults to BUILD_WAIT_BUDGET. */
    budgetMs?: number;
    /** Injectable for tests. */
    wait?: (ms: number, signal: AbortSignal) => Promise<void>;
    now?: () => number;
};

/** The delay a Retry-After header asks for, clamped to sensible bounds; the default when absent or malformed. */
export function retryDelay(header: string | null): number {
    if (!header || !/^[0-9]{1,5}$/.test(header)) return DEFAULT_DELAY;
    return Math.min(MAX_DELAY, Math.max(MIN_DELAY, Number(header) * 1000));
}

function sleep(ms: number, signal: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        if (signal.aborted) { reject(signal.reason ?? new DOMException("Aborted", "AbortError")); return; }
        const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, ms);
        function abort() { clearTimeout(timer); reject(signal.reason ?? new DOMException("Aborted", "AbortError")); }
        signal.addEventListener("abort", abort, { once: true });
    });
}

/** GETs url, retrying on 503 after the Retry-After it carries, until any other answer arrives or the budget is
 * spent. Resolves with the final response, which is the last 503 when the budget runs out. Rejects the way fetch
 * does, including with the signal's abort reason. */
export async function fetchWhileBuilding(url: string, options: BuildingFetchOptions): Promise<Response> {
    const { signal, onWaiting, budgetMs = BUILD_WAIT_BUDGET, wait = sleep, now = Date.now } = options;
    const started = now();
    for (;;) {
        const res = await fetch(url, { signal, cache: "no-store" });
        if (res.status !== 503) return res;
        const elapsed = now() - started;
        const delay = retryDelay(res.headers.get("Retry-After"));
        if (elapsed + delay > budgetMs) return res;
        onWaiting?.(elapsed);
        await wait(delay, signal);
    }
}
