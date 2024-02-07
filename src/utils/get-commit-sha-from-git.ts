import { execSync } from 'child_process';

export const getCommitShaFromGit = (): string | null => {
  try {
    return execSync('git rev-parse HEAD').toString().trim();
  } catch {
    return null;
  }
};
