import { randomUUID } from 'crypto';
import { type MetadataContainer } from '@modules/core/metadata';
import { type ICommand } from '../interfaces';

export class BaseCommand implements ICommand {
  public readonly traceId: string;
  public metadata: MetadataContainer;
  constructor(
    public readonly parentMetadata: MetadataContainer,
    public readonly id: string = randomUUID(),
  ) {
    this.traceId = parentMetadata.traceId;
    this.metadata = parentMetadata;
  }
}
