import {FileType} from 'sartography-workflow-lib';

export const getFileType = (file: File): FileType => {
  const s = file.name || file.type;
  const nameArray = s.toLowerCase().split(file.name ? '.' : '/');
  if (nameArray.length > 0) {
    const key = nameArray[nameArray.length - 1];
    return key as FileType;
  } else {
    return FileType.UNKNOWN;
  }
};

export const getFileIcon = (file: File): string => {
  return `/assets/icons/file_types/${getFileType(file)}.svg`;
}
