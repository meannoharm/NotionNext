import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Fade from '@mui/material/Fade';
import useScrollTrigger from '@mui/material/useScrollTrigger';

function ScrollTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 600,
  });

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({
        block: 'center',
      });
    }
  };

  return (
    <Fade in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <Fab size="small" aria-label="scroll back to top">
          <i className="fas fa-angle-up"></i>
        </Fab>
      </Box>
    </Fade>
  );
}

export default ScrollTop;
