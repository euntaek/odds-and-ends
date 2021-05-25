import { GetServerSideProps } from 'next';

function Profile() {
  return <div>profile</div>;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  return {
    props: {},
  };
};

export default Profile;
