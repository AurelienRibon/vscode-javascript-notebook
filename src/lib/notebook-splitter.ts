import { NotebookBlockSpec } from './notebook-block';

type SplitBlocksRuntime = {
  codeLines: string[];
  resultLines: string[];
  codeStartLineIndex: number;
  codeEndLineIndex: number;
  resultStartLineIndex: number;
  resultEndLineIndex: number;
  parsingCode: boolean;
};

export function splitBlocks(lines: string[]): NotebookBlockSpec[] {
  const blocks = [] as NotebookBlockSpec[];

  const runtime: SplitBlocksRuntime = {
    codeLines: [],
    resultLines: [],
    codeStartLineIndex: 0,
    codeEndLineIndex: 0,
    resultStartLineIndex: 0,
    resultEndLineIndex: 0,
    parsingCode: true,
  };

  for (const [lineIndex, line] of lines.entries()) {
    const isResultLine = line.startsWith('//>');
    const isCodeLine = !isResultLine;

    if (isCodeLine) {
      if (!runtime.parsingCode) {
        runtime.resultEndLineIndex = lineIndex;
        blocks.push(genBlockSpecFromSplitRuntime(runtime));
        runtime.parsingCode = true;
        runtime.codeLines = [line];
        runtime.codeStartLineIndex = lineIndex;
      } else {
        runtime.codeLines.push(line);
      }
    }

    if (isResultLine) {
      if (runtime.parsingCode) {
        runtime.codeEndLineIndex = lineIndex;
        runtime.parsingCode = false;
        runtime.resultLines = [line];
        runtime.resultStartLineIndex = lineIndex;
      } else {
        runtime.resultLines.push(line);
      }
    }
  }

  if (runtime.parsingCode) {
    runtime.codeEndLineIndex = lines.length;
    runtime.resultStartLineIndex = lines.length;
    runtime.resultEndLineIndex = lines.length;
    blocks.push(genBlockSpecFromSplitRuntime(runtime));
  } else {
    runtime.resultEndLineIndex = lines.length;
    blocks.push(genBlockSpecFromSplitRuntime(runtime));
  }

  return blocks;
}

function genBlockSpecFromSplitRuntime(runtime: SplitBlocksRuntime): NotebookBlockSpec {
  const { codeLines, codeStartLineIndex, codeEndLineIndex } = runtime;
  const { resultLines, resultStartLineIndex, resultEndLineIndex } = runtime;

  const code = codeLines.join('\n');
  const result = resultLines.join('\n');
  const codeRange = [codeStartLineIndex, codeEndLineIndex] as [number, number];
  const resultRange = [resultStartLineIndex, resultEndLineIndex] as [number, number];

  return { code, result, codeRange, resultRange };
}
