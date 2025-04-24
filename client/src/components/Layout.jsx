import React from 'react';
import Navbar from './Navbars/LoggedInNavbar';
import Footer from './Footer';

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