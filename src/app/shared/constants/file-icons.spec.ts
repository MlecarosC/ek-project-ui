import { getFileIcon, FILE_ICON_MAP, DEFAULT_FILE_ICON } from './file-icons';

describe('file-icons', () => {
  describe('getFileIcon', () => {
    it('should return correct icon for pdf', () => {
      expect(getFileIcon('pdf')).toBe('📄');
    });

    it('should return correct icon for doc', () => {
      expect(getFileIcon('doc')).toBe('📝');
    });

    it('should return correct icon for docx', () => {
      expect(getFileIcon('docx')).toBe('📝');
    });

    it('should return correct icon for xls', () => {
      expect(getFileIcon('xls')).toBe('📊');
    });

    it('should return correct icon for xlsx', () => {
      expect(getFileIcon('xlsx')).toBe('📊');
    });

    it('should return correct icon for images', () => {
      expect(getFileIcon('jpg')).toBe('🖼️');
      expect(getFileIcon('jpeg')).toBe('🖼️');
      expect(getFileIcon('png')).toBe('🖼️');
      expect(getFileIcon('gif')).toBe('🖼️');
    });

    it('should handle uppercase extensions', () => {
      expect(getFileIcon('PDF')).toBe('📄');
      expect(getFileIcon('DOCX')).toBe('📝');
      expect(getFileIcon('XLSX')).toBe('📊');
    });

    it('should handle mixed case extensions', () => {
      expect(getFileIcon('PdF')).toBe('📄');
      expect(getFileIcon('XlSx')).toBe('📊');
    });

    it('should return default icon for unknown extension', () => {
      expect(getFileIcon('unknown')).toBe(DEFAULT_FILE_ICON);
      expect(getFileIcon('xyz')).toBe(DEFAULT_FILE_ICON);
      expect(getFileIcon('mp4')).toBe(DEFAULT_FILE_ICON);
    });

    it('should handle empty string', () => {
      expect(getFileIcon('')).toBe(DEFAULT_FILE_ICON);
    });

    it('should handle whitespace', () => {
      expect(getFileIcon('  ')).toBe(DEFAULT_FILE_ICON);
    });
  });

  describe('FILE_ICON_MAP', () => {
    it('should have all expected extensions', () => {
      const expectedExtensions = [
        'pdf',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'jpg',
        'jpeg',
        'png',
        'gif',
      ];

      expectedExtensions.forEach(ext => {
        expect(FILE_ICON_MAP).toHaveProperty(ext);
      });
    });

    it('should have string emoji values', () => {
      Object.values(FILE_ICON_MAP).forEach(icon => {
        expect(typeof icon).toBe('string');
        expect(icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('DEFAULT_FILE_ICON', () => {
    it('should be a paperclip emoji', () => {
      expect(DEFAULT_FILE_ICON).toBe('📎');
    });
  });
});
