import { readFileSync } from 'fs';
import { resolve } from 'path';
import { getCommitShaFromGit } from './get-commit-sha-from-git';

export const parseRuntimeBuildInfo = (): { commitShortSha: string } => {
  try {
    const runtimeBuildInfoJson = readFileSync(resolve('.runtime-build-info'), {
      encoding: 'utf8',
    });
    return JSON.parse(runtimeBuildInfoJson);
  } catch (err) {
    if (err && (err as { code: string }).code === 'ENOENT') {
      const maybeCommitHash = getCommitShaFromGit();
      if (!maybeCommitHash) {
        return { commitShortSha: 'unknown' };
      }
      return {
        commitShortSha: maybeCommitHash,
      };
    }
    throw err;
  }
};
