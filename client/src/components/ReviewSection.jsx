import React, { useEffect, useState} from 'react';
function ReviewSection(){  
    const [review, setReview] = useState([]);



    useEffect(()=>{           

        fetch("http://localhost:4000/reviews")
        .then((res)=>res.json())
        .then((reviews)=>setReview(reviews))
        .catch((error)=>console.error("Unable to fetch reviews:",error));
    },[]);  
    return (
        <section id="testimonials-section" className="testimonials-container">
        <h2>See What Others Have To Say</h2>
        <div className="testimonials-list">
        {review.map((t) => (
          <div key={t._id} className="testimonial-item">
            {/* Optional avatar or image */}
            {t.avatarUrl && <img src={t.avatarUrl} alt={t.name} className="testimonial-avatar" />}
            <h3>
              {t.name}, {t.role}
            </h3>
            <p>{t.message}</p>
          </div>
        ))}     
        </div>
      </section>

    );



}
export default ReviewSection;