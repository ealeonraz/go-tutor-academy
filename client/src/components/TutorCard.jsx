import React from 'react';

const TutorCard = ({ tutor }) => {
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 text-center">
        <img src={tutor.image} alt={tutor.name} className="w-full h-40 object-cover rounded-t-lg" />
        <h3 className="font-bold text-lg mt-2">{tutor.name}</h3>
        <p className="text-gray-600">{tutor.rate}</p>
        <p className="text-gray-500">{tutor.subject}</p>
        <div className="text-yellow-500">{"★".repeat(tutor.stars)}</div>
      </div>
    );
  };

  export default TutorCard;