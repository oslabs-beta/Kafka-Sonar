// Login and Signup don't need to be passed as props to App b/c they display outside the app
export default interface Props {
  connect?: JSX.Element;
  brokerStats?: JSX.Element;
  // brokerIO?: JSX.Element;
  partitionStats?: JSX.Element;
  resourceUtil?: JSX.Element;
  networkEff?: JSX.Element;
}
