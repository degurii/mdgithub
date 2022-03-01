import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RepositoryBlog from './pages/RepositoryBlog';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path=":owner/:repo/*" element={<RepositoryBlog />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
