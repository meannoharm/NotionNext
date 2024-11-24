import { EmbeddedTweet, TweetNotFound, TweetSkeleton } from 'react-tweet';
import { Suspense, type FC } from 'react';
import { useNotionContext } from 'react-notion-x';

import type { ExtendedTweetRecordMap } from '@/types/notion';

const Tweet: FC<{
  id: string;
}> = ({ id }) => {
  const { recordMap } = useNotionContext();
  const tweet = (recordMap as ExtendedTweetRecordMap)?.tweets?.[id];

  return (
    <Suspense fallback={<TweetSkeleton />}>
      {tweet ? <EmbeddedTweet tweet={tweet} /> : <TweetNotFound />}
    </Suspense>
  );
};

export default Tweet;
