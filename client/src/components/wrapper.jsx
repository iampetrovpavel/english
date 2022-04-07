import React from 'react';

const Wrapper = ({children}) => (
    <div style={{maxWidth: '1024px', margin: '0 auto', height:'100%', padding: '0 1em', position: 'relative', overflow:'hidden'}}>
        {children}
    </div>
)

export default Wrapper;