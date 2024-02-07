import { type ExecutionContext } from '@nestjs/common';

export interface AuthStrategy {
  execute(context: ExecutionContext): Promise<boolean>;
}
