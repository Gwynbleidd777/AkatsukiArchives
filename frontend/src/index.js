import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const queryClient = new QueryClient(); // Create an instance of QueryClient

ReactDOM.render(
  <ChakraProvider>
    <QueryClientProvider client={queryClient}> {/* Wrap your app with QueryClientProvider */}
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </QueryClientProvider>
  </ChakraProvider>,
  document.getElementById('root')
);

reportWebVitals();
