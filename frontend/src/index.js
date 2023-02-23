import React from 'react';
import ReactDOM from 'react-dom/client';
import { CookiesProvider } from "react-cookie";
import App from './components/Login/App';
import Profile from './components/Profile/Profile';

import { LoginAction } from './components/Login/App';
import "./index.css"

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from "react-router-dom";
import NavLayout from './components/NavLayout';
import Logout from './components/Logout';

import MySubGreddit from './components/MySubGreddits/MySubGreddit';  
import CreateGreddit from './components/MySubGreddits/CreateGreddit';
import MyPage from './components/MySubGreddits/SubGredditPage/MyPage';
import MyNav from './components/MySubGreddits/SubGredditPage/MyNav';
import MyUser from './components/MySubGreddits/SubGredditPage/MyUser';
import MyRequests from './components/MySubGreddits/SubGredditPage/MyRequests';
import SubGreddits from './components/SubGreddits/SubGreddits';
import Page from './components/SubGreddits/SGPage/Page';
import SavedPosts from './components/SavedPosts/SavedPosts';
import MyReports from './components/MySubGreddits/SubGredditPage/MyReports';
import MyStat from './components/MySubGreddits/SubGredditPage/MyStat';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<App/>} action={LoginAction}/>
      <Route path ="/" element={<NavLayout/>}>
        <Route path="profile" element={<Profile />}/>
        <Route path="MySubGreddit" element={<MySubGreddit />}/>
        <Route path="CreateSubGreddit" element={<CreateGreddit/>} />
        <Route path="SubGreddit" element={<SubGreddits />} />
        <Route path ="SubGreddit/:user/:name" element={<Page />} />
        <Route path="SavedPosts" element={<SavedPosts />} />
      </Route>
      <Route path="/MySubGreddit/:name" element={<MyNav />}>
        <Route index element={<MyPage />}/>
        <Route path="users" element={<MyUser/>} key={document.location.href}/>
        <Route path="requests" element={<MyRequests />}/>
        <Route path="reports" element={<MyReports />}/>
        <Route path="stats" element={<MyStat />}/>
      </Route>
      <Route path="logout" element={<Logout/>}/>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CookiesProvider>
      <RouterProvider router={router} />
    </CookiesProvider>  
  </React.StrictMode>
);



