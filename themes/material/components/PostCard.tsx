import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import type { Page } from '@/types';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';

export interface PostCardProps {
  post: Page;
}

export default function PostCard({ post }: PostCardProps) {
  const { t } = useTranslation('common');
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${post.slug}`);
  };

  return (
    <Card>
      {post.pageCover && (
        <CardMedia
          sx={{ height: 140 }}
          image={post.pageCover}
          title="green iguana"
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {post.title}
        </Typography>
        <Typography gutterBottom variant="body1" component="div">
          {dayjs(post?.date).format('YYYY-MM-DD')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {post.summary}
        </Typography>
      </CardContent>
      <CardActions>
        <Box display="flex" justifyContent="flex-end" width="100%">
          <Button size="small" onClick={handleClick}>
            {t('read-more')}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}
