import type { Block } from 'notion-types';
import { PatchedCollection } from '@/types/notion';
import { isEmoji } from '@/utils';
import { NOTION_HOST } from '@/constants';

/**
 * 图片映射
 *
 * @param {*} img 图片地址，可能是相对路径，可能是外链
 * @param {*} block 数据块，可能是单个内容块，可能是Page
 * @param {*} type block 单个内容块 ； collection 集合列表
 * @param {*} from 来自
 * @returns
 */
export const mapImgUrl = (
  img: string,
  block: Block | PatchedCollection,
  type = 'block',
  needCompress = true,
) => {
  if (!img) {
    return '';
  }

  let ret = '';
  // 相对目录，则视为notion的自带图片
  if (img.startsWith('/')) {
    ret = NOTION_HOST + img;
  } else {
    ret = img;
  }

  // Notion 图床转换为永久地址
  const hasConverted =
    ret.includes('https://www.notion.so/image') ||
    ret.includes('notion.site/images/page-cover');

  // 需要转化的URL ; 识别aws图床地址，或者bookmark类型的外链图片
  const needConvert =
    !hasConverted &&
    ((block as Block).type === 'bookmark' ||
      ret.includes('secure.notion-static.com') ||
      ret.includes('prod-files-secure'));

  // 使用Notion图传
  if (needConvert) {
    ret =
      NOTION_HOST +
      '/image/' +
      encodeURIComponent(ret) +
      '?table=' +
      type +
      '&id=' +
      block.id;
  }

  if (
    ret &&
    ret.length > 4 &&
    !isEmoji(ret) &&
    !ret.includes('notion.so/images/page-cover') &&
    !ret.includes('https://www.notion.so/images/')
  ) {
    // 图片url优化，确保每一篇文章的图片url唯一
    // 图片接口拼接唯一识别参数，防止请求的图片被缓，而导致随机结果相同
    const separator = ret.includes('?') ? '&' : '?';
    ret = `${ret.trim()}${separator}t=${block.id}`;
  }

  // 统一压缩图片
  if (needCompress) {
    const width = block?.format?.block_width;
    ret = compressImage(ret, width);
  }

  return ret;
};

/**
 * 压缩图片
 * 1. Notion图床可以通过指定url-query参数来压缩裁剪图片 例如 ?xx=xx&width=400
 * 2. UnPlash 图片可以通过api q=50 控制压缩质量 width=400 控制图片尺寸
 * @param {*} image
 */
export const compressImage = (
  image: string,
  width = 1200,
  quality = 50,
  fmt = 'webp',
) => {
  if (!image) {
    return '';
  }
  if (image.indexOf(NOTION_HOST) === 0 && image.includes('amazonaws.com')) {
    return `${image}&width=${width}`;
  }
  // 压缩unsplash图片
  if (image.indexOf('https://images.unsplash.com/') === 0) {
    // 将URL解析为一个对象
    const urlObj = new URL(image);
    // 获取URL参数
    const params = new URLSearchParams(urlObj.search);
    // 将q参数的值替换
    params.set('q', quality.toString());
    // 尺寸
    params.set('width', width.toString());
    // 格式
    params.set('fmt', fmt);
    params.set('fm', fmt);
    // 生成新的URL
    urlObj.search = params.toString();
    return urlObj.toString();
  }

  // 此处还可以添加您的自定义图传的封面图压缩参数。
  // .e.g
  if (image.indexOf('https://your_picture_bed') === 0) {
    return 'do_somethin_here';
  }

  return image;
};
