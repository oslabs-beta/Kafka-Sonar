import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function BrokerStats() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={2.4}>
          <Item>Online Brokers</Item>
        </Grid>
        <Grid item xs={2.4}>
          <Item>Offline Brokers</Item>
        </Grid>
        <Grid item xs={2.4}>
          <Item>Active Controllers</Item>
        </Grid>
        <Grid item xs={2.4}>
          <Item>Unclean Leader Election Rate</Item>
        </Grid>
        <Grid item xs={2.4}>
          <Item>Avg RF</Item>
        </Grid>
      </Grid>
    </Box>
  );
}
