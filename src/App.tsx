import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TIL from './pages/TIL';
import NotFound from './pages/NotFound';

function App() {
  const [inputUrl, setInputUrl] = useState('');
  const handleChangeInputUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputUrl(e.target.value);
  };
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <Home
              inputUrl={inputUrl}
              handleChangeInputUrl={handleChangeInputUrl}
            />
          }
        />
        {/* <Route path="login" element={<Login />} /> */}
        <Route path=":owner/:repo/*" element={<TIL />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
