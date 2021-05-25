import { GetServerSideProps } from 'next';

function Followers() {
  return <div>profile</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {},
  };
};

export default Followers;
