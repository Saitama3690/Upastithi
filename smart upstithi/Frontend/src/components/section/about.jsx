import React from 'react'

const about = () => {
  return (
    <section id="about" className="section about">
            <div className="container">
              <div className="row gy-3">
                <div
                  className="col-lg-6"
                  data-aos="fade-up"
                  data-aos-delay="100"
                >
                  <img
                    src="assets/img/about-img.svg"
                    alt=""
                    className="img-fluid"
                  />
                </div>

                <div
                  className="col-lg-6 d-flex flex-column justify-content-center"
                  data-aos="fade-up"
                  data-aos-delay="200"
                >
                  <div className="about-content ps-0 ps-lg-3">
                    <h3>
                      Voluptatem dignissimos provident quasi corporis voluptates
                      sit assumenda.
                    </h3>
                    <p className="fst-italic">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <ul>
                      <li>
                        <i className="bi bi-diagram-3"></i>
                        <div>
                          <h4>Ullamco laboris nisi ut aliquip consequat</h4>
                          <p>
                            Magni facilis facilis repellendus cum excepturi
                            quaerat praesentium libre trade
                          </p>
                        </div>
                      </li>
                      <li>
                        <i className="bi bi-fullscreen-exit"></i>
                        <div>
                          <h4>
                            Magnam soluta odio exercitationem reprehenderi
                          </h4>
                          <p>
                            Quo totam dolorum at pariatur aut distinctio dolorum
                            laudantium illo direna pasata redi
                          </p>
                        </div>
                      </li>
                    </ul>
                    <p>
                      Ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Duis aute irure dolor in reprehenderit in voluptate velit
                      esse cillum dolore eu fugiat nulla pariatur. Excepteur
                      sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
  )
}

export default about
