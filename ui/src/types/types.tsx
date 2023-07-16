// Login and Signup don't need to be passed as props to App b/c they display outside the app
export default interface Props {
  connect?: JSX.Element;
  resourceUsage?: JSX.Element;
  clusterView?: JSX.Element;
  partitionView?: JSX.Element;
}
