import React from 'react'
import { Route,Routes } from 'react-router';
import App from '../App';
import { ChatPage } from '../components/ChatPage';
import Hello from '../components/hello';

export const AppRoutes = () => {
  return (
    <Routes>
    <Route path="/" element={ <App/>}/>
    <Route path="/chat" element={<ChatPage/>}/>
    <Route path="/about" element={ <h1>This is a about page</h1>}/>
    <Route path="*" element={ <h1>404 Page Not Found !</h1>}/>
    <Route path="/hello" element={ <Hello/>}/>
   </Routes>
  )
};
export default AppRoutes;
