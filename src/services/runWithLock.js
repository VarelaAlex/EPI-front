export const runWithLock = async (lockFn, task) => {
    if (typeof task !== "function") return;

    lockFn(true);
    try {
        await task();
    } finally {
        lockFn(false);
    }
};