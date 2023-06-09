import NavDrawer from '../components/NavDrawer';

interface Props {
  brokerStats?: JSX.Element;
  partitionStats?: JSX.Element;
  brokerUtil?: JSX.Element;
  brokerIO?: JSX.Element;
  topicIO?: JSX.Element;
}

function Dashboard(props: Props) {
  const { brokerStats, partitionStats, brokerUtil, brokerIO, topicIO } = props;
  return (
    <>
      <NavDrawer
        brokerStats={brokerStats}
        partitionStats={partitionStats}
        brokerUtil={brokerUtil}
        brokerIO={brokerIO}
        topicIO={topicIO}
      />
    </>
  );
}

export default Dashboard;
