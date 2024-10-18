import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p>&copy; {currentYear} Thor Tech Solutions LLC. All rights reserved.</p>
        <p>Incident Management SaaS v1.0.0</p>
      </div>
    </footer>
  );
};

export default Footer;