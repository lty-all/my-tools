export interface Tool {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  isAI: boolean;
  category?: string;
}

export interface ToolHistory {
  id: number;
  userId: number;
  toolId: number;
  input: string;
  output: string;
  createdAt: string;
}

export interface ExecuteToolDto {
  input: string;
}

export interface ExecuteToolResult {
  result: string;
}
