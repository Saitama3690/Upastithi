import React from 'react'

const hero = () => {
  return (
    <section id="hero" className="section hero light-background">
    <div className="container">
      <div className="row gy-4">
        <div
          className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center"
          data-aos="fade-up"
        >
          <h1>Bettter digital experience with Upstithi</h1>
          <p>We are team of devlopers</p>
          <div className="d-flex">
            <a href="/login" className="btn-get-started">
              Get Started
            </a>
            <a
              href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
              className="glightbox btn-watch-video d-flex align-items-center"
            >
              <i className="bi bi-play-circle"></i>
              <span>Watch Video</span>
            </a>
          </div>
        </div>
        <div
          className="col-lg-6 order-1 order-lg-2 hero-img"
          data-aos="zoom-out"
          data-aos-delay="200"
        >
          <img
            src="src/assets/img/hero-img.svg"
            className="img-fluid animated"
            alt=""
          />
        </div>
      </div>
    </div>
  </section>
  )
}

export default hero
