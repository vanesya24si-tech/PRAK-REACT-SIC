import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Ubah import ini agar mengarah ke folder pertemuan-4
import FrameworkList from './pertemuan-4/FrameworkList.jsx'
import "./tailwind.css";
import ResponsiveText from './pertemuan-4/ResponsiveTextDesign.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ResponsiveText />
  </StrictMode>,
)
