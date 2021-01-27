import { Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  object: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2, 2, 2),
  },
  list: {
    width: 250,
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <div>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexDirection='column'
      >
        <Typography variant='h4' className={classes.object}>
          Welcome to Agri-Man
        </Typography>
        <img
          src='rs.jpg'
          alt=''
          resizeMode={'cover'}
          className={classes.object}
        />
      </Box>
    </div>
  );
};
export default Home;
