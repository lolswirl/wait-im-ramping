"use client";

export function useBranchName(): string | null {
    const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
    
    if (isProduction) {
        return null;
    }
    
    const vercelBranch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
    
    if (vercelBranch === 'main' || vercelBranch === 'master') {
        return null;
    }
    
    return vercelBranch || process.env.NEXT_PUBLIC_BRANCH_NAME || null;
}

export function useIsNonProd(): boolean {
    const branchName = useBranchName();
    return branchName !== null;
}