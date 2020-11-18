import { inspect } from 'util';
import { NotebookBlock } from './notebook-block';
import { splitBlocks } from './notebook-splitter';

export class Notebook {
  public blocks: NotebookBlock[];
  public linesCount: number;

  constructor() {
    this.blocks = [];
    this.linesCount = 0;
  }

  refresh(text: string): void {
    const lines = text.split('\n');
    const specs = splitBlocks(lines);

    this.blocks = specs.map((it) => new NotebookBlock(it));
    this.linesCount = lines.length;

    for (const block of this.blocks) {
      const newResult = prepareResult(evalBlock(block));
      const oldResult = block.result;
      block.result = newResult;
      block.dirty = newResult !== oldResult;
    }
  }
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

function evalBlock(block: NotebookBlock): unknown {
  try {
    return eval(block.code);
  } catch (err) {
    return err;
  }
}

function prepareResult(result: unknown): string {
  const string = formatResult(result);
  return string.replace(/^/gm, '//> ');
}

function formatResult(result: unknown): string {
  return inspect(result, { breakLength: 80, depth: 5, maxArrayLength: 20, maxStringLength: 1000 });
}
