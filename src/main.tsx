// main.tsx
import React from 'react'
import { createRoot } from 'react-dom/client';
import App from './components/App.tsx'


const domRoot = document.getElementById("root");
const root = createRoot(domRoot!);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)