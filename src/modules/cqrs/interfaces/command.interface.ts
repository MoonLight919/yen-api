import { type ICommand as INestCommand } from '@nestjs/cqrs';
import { type MetadataContainer } from '@modules/core/metadata';

export interface ICommand extends INestCommand {
  id: string;
  traceId: string;
  metadata: MetadataContainer;
  parentMetadata: MetadataContainer;
}
