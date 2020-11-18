import { NotebookRange } from './notebook-range';

export type NotebookBlockSpec = Pick<NotebookBlock, 'code' | 'result' | 'codeRange' | 'resultRange'>;

export class NotebookBlock {
  public code: string;
  public result: string;
  public codeRange: NotebookRange;
  public resultRange: NotebookRange;
  public dirty: boolean;

  constructor(spec: NotebookBlockSpec) {
    this.code = spec.code;
    this.result = spec.result;
    this.codeRange = spec.codeRange;
    this.resultRange = spec.resultRange;
    this.dirty = true;
  }
}
