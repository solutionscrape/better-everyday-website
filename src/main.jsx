import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens/colors.css';
import './styles/tokens/typography.css';
import './styles/tokens/spacing.css';
import './styles/tokens/radius.css';
import './styles/tokens/elevation.css';
import './styles/tokens/motion.css';
import './styles/tokens/base.css';
import './styles/global.css';
import App from './App.jsx';
import { CartProvider } from './lib/cart.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
);
