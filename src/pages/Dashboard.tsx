import NavDrawer from '../components/NavDrawer';

interface Props {
  brokerStats?: JSX.Element;
  partitionStats?: JSX.Element;
}

function Dashboard(props: Props) {
  const { brokerStats, partitionStats } = props;
  return (
    <>
      <NavDrawer brokerStats={brokerStats} partitionStats={partitionStats} />
    </>
  );
}

export default Dashboard;
