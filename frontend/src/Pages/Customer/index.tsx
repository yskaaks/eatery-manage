// AuthHome component
import React from 'react';
import Header from "../../components/Header/Header";
import Map from "../../components/Map/Map";
import SearchBar from "../../components/SearchBar/SearchBar";
import { useEffect} from 'react';

import "@react-google-maps/api";
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';  // Import useHistory


const AuthHome: React.FC = () => {
  const navigate = useNavigate();
  const checkToken = localStorage.getItem('token')

  useEffect(() => {
    if (!checkToken) {
      navigate('/');
    }
  }, [checkToken, navigate]);

  if (!checkToken) {
    return null;
  }


  return (
    <div className='auth-home'>
      <Header>
        <h3>Discover Restaurants</h3>
      </Header>
      <SearchBar />
      <h3 className='near-you'>Near You</h3>
      <Map />
      <Footer />
    </div>
  );
}

export default AuthHome;