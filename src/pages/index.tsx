import axios from 'axios';
import { useEffect } from 'react';

export default function Home({}) {
  useEffect(() => {
    (async () => {
      const response = await axios.get('api/health'); // api 상태 확인
      console.log(response.data);
    })();
  }, []);

  return (
    <div>
      <h1>Hello teanpho!</h1>
    </div>
  );
}
