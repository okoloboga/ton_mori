import React from 'react';

const BackgroundVideo = () => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'blue', zIndex: -1 }}>
      Test Background
    </div>
  );
};

export default BackgroundVideo;
