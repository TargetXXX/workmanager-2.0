import React from 'react';
import imga from '../images/index.jpg';

const style: React.CSSProperties = {
  width: '100%',
}

const Home: React.FC = () => {
  return (
    <div  style={style}>
      <img src={imga} className='savatar' alt="" style={style}/>
    </div>
  );
};

export default Home;