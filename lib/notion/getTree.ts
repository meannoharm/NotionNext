import { Decoration } from '@/types/notion';

/**
 * Attempts to find parent from a given property.
 * type of prop like this
 * [ '‣', ['p','parent id','space id'] ]
 */
export const getParentId = (prop: Decoration[]): string | null => {
  if (!prop) {
    return null;
  } else if (!Array.isArray(prop)) {
    return null;
  }
  if (prop[0][1]) {
    return prop[0][1][0][1] ? (prop[0][1][0][1] as string) : null;
  } else return null;
};

/**
 * Attempts to find children's id from a given property.
 * type of prop like this
 * [
 *   [ '‣', ['p','parent id','space id'] ],
 *   [ ',' ],
 *   [ '‣', ['p','parent id','space id'] ],
 *   [ ',' ],
 *   [ '‣', ['p','parent id','space id'] ],
 * ]
 */
export const getChildrenIds = (prop: Decoration[]): string[] | null => {
  if (!prop) {
    return null;
  } else if (!Array.isArray(prop)) {
    return null;
  }
  const res: string[] = [];
  prop.forEach((item) => {
    if (item[0] === '‣' && item[1] && item[1][0][1]) {
      res.push(item[1][0][1] as string);
    }
  });
  return res.length > 0 ? res : null;
};
