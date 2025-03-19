import React from "react";
import Footer from "./basic/footer";
import Header from "./basic/header";
import Hero from "./section/hero";
import About from "./section/about";
import Sections from "./section/sections";
import Contact from './section/contact'
import Clients from './section/clients'
import Team from './section/team'
import Faq from './section/faq'
const Landing = () => {
  return (
    <>
      <div>
        <Header />

        <main className="main">
          <Hero />
          <About />
          <Sections />
          <Faq />
          <Team />
          <Clients />
          <Contact />
        </main>


        <Footer />
      </div>
    </>
  );
};

export default Landing;
