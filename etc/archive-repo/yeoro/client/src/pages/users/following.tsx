import { GetServerSideProps } from 'next';

function Following() {
  return <div>profile</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {},
  };
};

export default Following;
