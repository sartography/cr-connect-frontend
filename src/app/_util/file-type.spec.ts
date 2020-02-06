import {FileType} from 'sartography-workflow-lib';
import {getFileIcon, getFileType} from './file-type';

const files = {
  jpgFile: new File([], 'jfjdfdfdsjdfskdfaslfdsd.jpg'),
  xlsxFile: new File(
    [], 'Hello, silly document!_2020-02-02.v2.xlsx',
    {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
  ),
  jpegFile: new File([], 'This file has no extension', {type: 'image/jpeg'}),
  svgXmlFile: new File([], '', {type: 'image/svg+xml'}),
  unknownExt: new File([], 'bleepblop.zorp', {type: 'fnord/glopper'}),
  unknownType: new File([], 'Extension not has also this file', {type: 'fnord/glopper'}),
};

describe('getFileType', () => {
  it('should get FileType from a file name', () => {
    expect(getFileType(files.jpgFile)).toEqual(FileType.JPG);
    expect(getFileType(files.xlsxFile)).toEqual(FileType.XLSX);
  });

  it('should get FileType from the file type', () => {
    expect(getFileType(files.jpegFile)).toEqual(FileType.JPEG);
    expect(getFileType(files.svgXmlFile)).toEqual(FileType.SVG_XML);
  });

  it('should return unknown FileType for an unrecognized extension', () => {
    expect(getFileType(files.unknownExt)).toEqual(FileType.UNKNOWN);
  });

  it('should return unknown FileType for an unrecognized extension', () => {
    expect(getFileType(files.unknownType)).toEqual(FileType.UNKNOWN);
  });
});

describe('getFileIcon', () => {
  it('should get file icon SVG path for all file types', () => {
    Object.values(files).forEach(f => {
      expect(getFileIcon(f)).toBeTruthy();
    });
  });
});
