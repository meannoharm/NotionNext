import BLOG from 'blog.config';
import Giscus from '@giscus/react';
import { useStyleStore } from '@/providers/styleProvider';
import { useTranslation } from 'next-i18next';
import type {
  BooleanString,
  Loading,
  Mapping,
  InputPosition,
} from '@giscus/react';

/**
 * Giscus评论 @see https://giscus.app/zh-CN
 * @returns {JSX.Element}
 * @constructor
 */

const GiscusComponent = () => {
  const isDarkMode = useStyleStore((state) => state.isDarkMode);
  const {
    i18n: { language },
  } = useTranslation();
  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <Giscus
      repo={BLOG.COMMENT_GISCUS_REPO as `${string}/${string}`}
      repoId={BLOG.COMMENT_GISCUS_REPO_ID}
      categoryId={BLOG.COMMENT_GISCUS_CATEGORY_ID}
      mapping={BLOG.COMMENT_GISCUS_MAPPING as Mapping}
      reactionsEnabled={BLOG.COMMENT_GISCUS_REACTIONS_ENABLED as BooleanString}
      emitMetadata={BLOG.COMMENT_GISCUS_EMIT_METADATA as BooleanString}
      theme={theme}
      inputPosition={BLOG.COMMENT_GISCUS_INPUT_POSITION as InputPosition}
      lang={language}
      loading={BLOG.COMMENT_GISCUS_LOADING as Loading}
    />
  );
};

export default GiscusComponent;
