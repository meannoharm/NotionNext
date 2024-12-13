import Giscus from '@giscus/react';
import { useStyleStore } from '@/providers/styleProvider';
import { useTranslation } from 'next-i18next';

import { useConfigStore } from '@/providers/configProvider';
import { useShallow } from 'zustand/react/shallow';

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
  const {
    GISCUS_REPO,
    GISCUS_REPO_ID,
    GISCUS_CATEGORY_ID,
    GISCUS_MAPPING,
    GISCUS_REACTIONS_ENABLED,
    GISCUS_EMIT_METADATA,
    GISCUS_INPUT_POSITION,
    GISCUS_LOADING,
  } = useConfigStore(
    useShallow((state) => ({
      GISCUS_REPO: state.GISCUS_REPO,
      GISCUS_REPO_ID: state.GISCUS_REPO_ID,
      GISCUS_CATEGORY_ID: state.GISCUS_CATEGORY_ID,
      GISCUS_MAPPING: state.GISCUS_MAPPING,
      GISCUS_REACTIONS_ENABLED: state.GISCUS_REACTIONS_ENABLED,
      GISCUS_EMIT_METADATA: state.GISCUS_EMIT_METADATA,
      GISCUS_INPUT_POSITION: state.GISCUS_INPUT_POSITION,
      GISCUS_LOADING: state.GISCUS_LOADING,
    })),
  );

  return (
    <Giscus
      repo={GISCUS_REPO}
      repoId={GISCUS_REPO_ID}
      categoryId={GISCUS_CATEGORY_ID}
      mapping={GISCUS_MAPPING}
      reactionsEnabled={GISCUS_REACTIONS_ENABLED}
      emitMetadata={GISCUS_EMIT_METADATA}
      theme={theme}
      inputPosition={GISCUS_INPUT_POSITION}
      lang={language}
      loading={GISCUS_LOADING}
    />
  );
};

export default GiscusComponent;
