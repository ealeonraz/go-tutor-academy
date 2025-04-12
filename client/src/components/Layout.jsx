import React from 'react';
import Navbar from './logged-in-main-navbar';
import Footer from './Footer';

import "./Component.css"

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            {/* Include the Navbar */}
            <Navbar />
            
            {/* Main Content */}
            <main className="layout-content">
                {children}
            </main>
            
            {/* Include the Footer */}
            <Footer />
        </div>
    );
};

export default Layout;