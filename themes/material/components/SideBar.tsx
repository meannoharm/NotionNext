import { useSiteStore } from '@/providers/siteProvider';
import {
  Avatar,
  BottomNavigation,
  BottomNavigationAction,
  Divider,
  Stack,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useConfigStore } from '@/providers/configProvider';
import { useShallow } from 'zustand/react/shallow';
import md5 from 'js-md5';
import { useTranslation } from 'react-i18next';

const AVATAR_SIZE = 120;

const SideBar = () => {
  const { EMAIL, AUTHOR } = useConfigStore(
    useShallow((state) => ({
      EMAIL: state.EMAIL,
      AUTHOR: state.AUTHOR,
      GITHUB_URL: state.GITHUB_URL,
    })),
  );
  const { tagOptions, categoryOptions, totalPostsCount } = useSiteStore(
    useShallow((state) => ({
      tagOptions: state.tagOptions,
      categoryOptions: state.categoryOptions,
      totalPostsCount: state.totalPostsCount,
    })),
  );
  const { t } = useTranslation('nav');
  const siteInfo = useSiteStore((state) => state.siteInfo);

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1} alignItems="center">
          <Avatar
            alt={AUTHOR}
            src={`https://gravatar.com/avatar/${md5(EMAIL)}?s=${AVATAR_SIZE}`}
            sx={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
          />
          <Typography variant="h6" component="div">
            {AUTHOR}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {siteInfo?.description}
          </Typography>
          <Divider />
          <BottomNavigation showLabels>
            <BottomNavigationAction
              label={t('posts')}
              icon={<span>{totalPostsCount}</span>}
            />
            <BottomNavigationAction
              label={t('tags')}
              icon={<span>{tagOptions.length}</span>}
            />
            <BottomNavigationAction
              label={t('category')}
              icon={<span>{categoryOptions.length}</span>}
            />
          </BottomNavigation>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SideBar;
