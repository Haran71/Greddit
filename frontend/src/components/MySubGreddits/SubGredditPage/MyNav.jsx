import {React, useState} from "react";
import { NavLink,Outlet, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


// material UI icons
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SummarizeIcon from '@mui/icons-material/Summarize';
import QueryStatsIcon from '@mui/icons-material/QueryStats';


function MyNav(){
    const navigate = useNavigate();
    const {name} = useParams();
    const path = "/MySubGreddit/" + name;
    return (
        <div>
          <header>
            <nav>
              <h1>Greddit</h1>
              <NavLink to={path}><ContactPageIcon /></NavLink>
              <NavLink to="requests"><RequestPageIcon /></NavLink>
              <NavLink to="users"><PeopleIcon/></NavLink>
              <NavLink to="reports"><SummarizeIcon/></NavLink>
              <NavLink to="stats"><QueryStatsIcon/></NavLink>
              <NavLink to="/SavedPosts"><ReceiptLongIcon/></NavLink>
              <NavLink to="/SubGreddit"><FeaturedPlayListIcon /></NavLink>
              <NavLink to="/MySubGreddit"><MenuBookIcon/></NavLink>
              <NavLink to="/profile"><AccountBoxIcon/></NavLink>
              <NavLink to="/logout"><LogoutIcon /></NavLink>
            </nav>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      )
}

export default MyNav;