import {React, useState} from "react";
import { NavLink,Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";


// material UI icons
import LogoutIcon from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';


function NavLayout(){
    const navigate = useNavigate();
    return (
        <div>
          <header>
            <nav>
              <h1>Greddit</h1>
              <NavLink to="SavedPosts"><ReceiptLongIcon/></NavLink>
              <NavLink to="SubGreddit"><FeaturedPlayListIcon /></NavLink>
              <NavLink to="MySubGreddit"><MenuBookIcon/></NavLink>
              <NavLink to="profile"><AccountBoxIcon/></NavLink>
              <NavLink to="logout"><LogoutIcon /></NavLink>
            </nav>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      )
}

export default NavLayout;