import {FileMeta} from 'sartography-workflow-lib/lib/types/file';

export interface FileGroup {
  group: string;
  files: FileMeta[];
}
