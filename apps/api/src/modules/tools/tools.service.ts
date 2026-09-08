import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ToolsService {
  private readonly tools = [
    { id: 1, name: 'JSON Formatter', slug: 'json-formatter', isAI: false },
    { id: 2, name: 'JWT Decoder', slug: 'jwt-decoder', isAI: false },
    { id: 3, name: 'Regex Tester', slug: 'regex-tester', isAI: false },
    { id: 4, name: 'Timestamp Converter', slug: 'timestamp-converter', isAI: false },
    { id: 5, name: 'Diff Checker', slug: 'diff-checker', isAI: false },
    { id: 6, name: 'Subtitle Resync', slug: 'subtitle-resync', isAI: false, category: 'local-privacy' },
    { id: 7, name: 'Video to GIF', slug: 'video-to-gif', isAI: false, category: 'local-privacy' },
    { id: 8, name: 'EXIF Cleaner', slug: 'exif-cleaner', isAI: false, category: 'local-privacy' },
    { id: 9, name: 'AI Code Explain', slug: 'ai-code-explain', isAI: true },
    { id: 10, name: 'AI Error Fix', slug: 'ai-error-fix', isAI: true },
    { id: 11, name: 'AI Commit Generator', slug: 'ai-commit-generator', isAI: true },
  ];

  findAll() {
    return this.tools;
  }

  formatJson(input: string) {
    try {
      const parsed = JSON.parse(input);
      return { result: JSON.stringify(parsed, null, 2) };
    } catch {
      throw new BadRequestException('Invalid JSON input');
    }
  }
}
