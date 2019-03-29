import { VId } from './VGenericTypes';
import { VMetadata } from './VMetadata';

export interface VAsset {
  id: VId;
  createdTime?: number;
  depth?: number;
  description?: string;
  metadata?: VMetadata;
  name?: string;
  path?: VId[];
}
