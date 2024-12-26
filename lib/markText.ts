import Mark from 'mark.js';

export default function markText(
  context: string | HTMLElement | readonly HTMLElement[] | NodeList,
  search: string,
  target: Mark.MarkRegExpOptions,
) {
  const mark = new Mark(context);
  const reg = new RegExp(search, 'gim');
  mark.markRegExp(reg, target);
}
