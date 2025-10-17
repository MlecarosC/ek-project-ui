export const FILE_ICON_MAP = {
  pdf: '📄',
  doc: '📝',
  docx: '📝',
  xls: '📊',
  xlsx: '📊',
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
  gif: '🖼️',
} as const;

export type SupportedFileExtension = keyof typeof FILE_ICON_MAP;
export const DEFAULT_FILE_ICON = '📎';

export function getFileIcon(extension: string): string {
  const normalized = extension.toLowerCase();
  return FILE_ICON_MAP[normalized as SupportedFileExtension] ?? DEFAULT_FILE_ICON;
}
