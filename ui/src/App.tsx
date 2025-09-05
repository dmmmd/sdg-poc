import React, { useEffect, useState } from 'react';

function App() {
  const [hello, setHello] = useState('');

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ getHello }' }),
    })
      .then(res => res.json())
      .then(data => setHello(data.data.getHello));
  }, []);

  return <h1>{hello || 'Loading...'}</h1>;
}

export default App;
