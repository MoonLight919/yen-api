import { randomUUID } from 'crypto';
import { MetadataContainer } from '@modules/core/metadata';

export const getRandomMetadata = (
  traceId = randomUUID(),
  parentTraceId = randomUUID(),
  idUser = randomUUID(),
): MetadataContainer => {
  const metadata = new MetadataContainer(traceId, parentTraceId);
  metadata.setIdUser(idUser);
  return metadata;
};
