import React from 'react';
import ReactLoading from 'react-loading';

const Loading = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
    }}>
        <ReactLoading type={'bars'} color={'#357edd'} height={40} width={40} />
    </div>
);

export default Loading;


