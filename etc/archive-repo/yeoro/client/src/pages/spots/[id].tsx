import { GetServerSideProps } from 'next';

function Spot() {
  return <div></div>;
}

export default Spot;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {},
  };
};
