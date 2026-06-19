"use client";

export function useBranchName(): string | null {
    const branch = process.env.NEXT_PUBLIC_CF_PAGES_BRANCH;

    if (!branch || branch === 'main' || branch === 'master') {
        return null;
    }

    return branch;
}

export function useIsNonProd(): boolean {
    const branchName = useBranchName();
    return branchName !== null;
}