import React from "react";
import HomeNavBar from "../AppHomeNavBar/AppHomeNavBar";
import "./Home.css";
import { Carousel, Thumbs } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useHistory } from "react-router-dom";

function ApplicationHome() {
  const history = useHistory()
  console.log('window', window)
  return (
    <>
      <HomeNavBar />

      <div className="site-wrapper">
        {/* <div className="doc-loader">
                    <img src="preloader.gif" alt="Seppo" />
                </div> */}

        <div id="content" className="site-content center-relative">
          {/* <!-- Home Section --> */}
          <div id="home" className="section no-page-title">
            <div className="section-wrapper block content-1170 d-flex">
              <div className="content-wrapper" style={{width:'80%'}}>
                <h1 className="medium-text">
                We are paid to turn imaginations into drawings
                </h1>
                <div className="button-holder text-left">
                  <a href="#about" className="button">
                    LEARN MORE
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- Services Section --> */}
          <div id="services" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">SERVICES</h3>
            </div>
            <div className="section-wrapper block content-1170 d-flex flex-wrap justify-content-between">
              {/* <div className="content-wrapper"> */}
              <div className="one_third">
                <div className="service-holder">
                  <p className="service-num">1</p>
                  <div className="service-txt">
                    <h4>Utility Patent Drawings</h4>
                    <p>
                      PatentAide specializes in creation of high quality Utility
                      Drawings for Patent applications.
                    </p>
                    <br />
                    <div className="button-holder text-left" onClick={()=>history.push('/services')}>
                      <a className="button-dot">
                        <span>MORE</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="one_third">
                <div className="service-holder">
                  <p className="service-num">2</p>
                  <div className="service-txt">
                    <h4>Design Patent Drawings</h4>
                    <p>
                      We render perfect shadings to your design drawings and
                      help you include every possible view of the invention.
                    </p>
                    <br />
                    <div className="button-holder text-left" onClick={()=>history.push('/services')}>
                      <a className="button-dot">
                        <span>MORE</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="one_third">
                <div className="service-holder">
                  <p className="service-num">3</p>
                  <div className="service-txt">
                    <h4>Trademark Drawings</h4>
                    <p>
                      Protect your brand with accurate and meaningful drawings.
                    </p>
                    <br />
                    <br />
                    <div className="button-holder text-left" onClick={()=>history.push('/services')}>
                      <a className="button-dot">
                        <span>MORE</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="clear"></div> */}
              {/* </div> */}
            </div>
          </div>

          {/* <!-- About Section --> */}
          <div id="about" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">ABOUT</h3>
            </div>
            <div className="section-wrapper block content-1170 d-flex">
              <div className="content-wrapper">
                <div className="one_half">
                  <p className="title-description-up">WHO WE ARE</p>
                  <h2 className="entry-title medium-text">
                    A little background on PatentAide.
                  </h2>
                  <p>
                    We started with a vision to revolutionize the patent
                    drawings industry by utilizing technology to enhance user
                    experience and taking the hassle out for our customers.
                  </p>
                  <br />
                  <div className="button-holder text-left">
                    <a className="button" onClick={()=>history.push('/about-us')}>
                      LEARN MORE
                    </a>
                  </div>
                </div>
                <div className="clear"></div>
              </div>
            </div>
          </div>

          {/* <!-- Portfolio Section --> */}
          <div id="portfolio" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">PORTFOLIO</h3>
            </div>
            <div id="portfolio" className="section no-page-title">
              <div className="section-wrapper block content-1170 d-flex">
                {/* <div className="content-wrapper"> */}
                <div
                  className="one"
                  data-threshold="0 0"
                  data-jarallax-element="120 0"
                >
                  <div className="text-slider-wrapper-gallery">
                    <Carousel
                      showArrows={true}
                      showThumbs={window?.screen?.width >= 768 }
                      showStatus={false}
                      // dynamicHeight
                    >
                      <div className="text-slide" style={{ height: "30rem" }}>
                        <img
                          src="portfolio-1.png"
                          alt="portfolio-1.png"
                          style={{
                            height: "fit-content",
                          }}
                        />
                      </div>
                      <div className="text-slide" style={{ height: "30rem" }}>
                        <img
                          src="portfolio-2.png"
                          alt="portfolio-2.png"
                          style={{
                            height: "fit-content",
                          }}
                        />
                      </div>
                      <div className="text-slide" style={{ height: "30rem" }}>
                        <img
                          src="portfolio-3.png"
                          alt="portfolio-3.png"
                          style={{
                            height: "fit-content",
                          }}
                        />
                      </div>
                      <div className="text-slide" style={{ height: "30rem" }}>
                        <img
                          src="portfolio-4.png"
                          alt="portfolio-4.png"
                          style={{
                            height: "fit-content",
                          }}
                        />
                      </div>
                      <div className="text-slide" style={{ height: "30rem" }}>
                        <img
                          src="portfolio-5.png"
                          alt="portfolio-5.png"
                          style={{
                            height: "fit-content",
                          }}
                        />
                      </div>
                      <div className="text-slide" style={{ height: "30rem" }}>
                        <img
                          src="portfolio-6.png"
                          alt="portfolio-6.png"
                          style={{
                            height: "fit-content",
                          }}
                        />
                      </div>
                      <div className="text-slide" style={{ height: "30rem" }}>
                        <img
                          src="portfolio-7.png"
                          alt="portfolio-7.png"
                          style={{
                            height: "fit-content",
                          }}
                        />
                      </div>
                      <div className="text-slide" style={{ height: "30rem" }}>
                        <img
                          src="portfolio-8.png"
                          alt="portfolio-8.png"
                          style={{
                            height: "fit-content",
                          }}
                        />
                      </div>
                    </Carousel>
                    <div className="clear"></div>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>

          {/* <!-- News Section --> */}
          <div id="news" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">TESTIMONIALS</h3>
            </div>
            {/* <!-- Clients Section --> */}
            <div id="clients" className="section no-page-title">
              <div className="section-wrapper block content-1170 d-flex">
                {/* <div className="content-wrapper"> */}
                <div
                  className="one"
                  data-threshold="0 0"
                  data-jarallax-element="120 0"
                  style={{width: '100%'}}
                >
                  <div className="text-slider-wrapper relative">
                    <div className="text-slider-header-quotes"></div>
                    <div
                      id="textSlider"
                      className="text-slider slider owl-carousel owl-theme"
                    >
                      <Carousel
                        showArrows={true}
                        showThumbs={false}
                        showStatus={false}
                      >
                        <div className="text-slide">
                          <p className="text-slide-content">
                            PatentAide came through on a very complex drawing
                            assignment. I tried out a few vendors but
                            Patenaide’s draft was the best and competitively
                            priced.
                          </p>
                          {/* <img
                            className="text-slide-img"
                            src="quote_image_03.jpg"
                            alt=""
                          /> */}
                          <p className="text-slide-name">IP Manager</p>
                          <p className="text-slide-position">
                            US corporate based in California
                          </p>
                        </div>
                        <div className="text-slide">
                          <p className="text-slide-content">
                            We absolutely recommend using PatentAide’s services.
                            The thing I liked the most is how detail oriented
                            they are and their inclination to inculcate
                            technology into an age old process.
                          </p>
                          {/* <img
                            className="text-slide-img"
                            src="quote_image_04.jpg"
                            alt=""
                          /> */}
                          <p className="text-slide-name">Partner</p>
                          <p className="text-slide-position">
                            Of a larger law firm based in New York
                          </p>
                        </div>
                        <div className="text-slide">
                          <p className="text-slide-content">
                            I was working on a very tight schedule and needed
                            the drawings ASAP. PatentAide came to the rescue and
                            delivered the drawings within 24 hours. Haven’t seen
                            a better turnaround than them.
                          </p>
                          {/* <img
                            className="text-slide-img"
                            src="quote_image_02.jpg"
                            alt=""
                          /> */}
                          <p className="text-slide-name">Partner</p>
                          <p className="text-slide-position">
                            Of a law firm based in Florida
                          </p>
                        </div>
                        <div className="text-slide">
                          <p className="text-slide-content">
                            We have used PatentAide for design drawings and
                            every time they have exceeded our expectations. They
                            do not leave any scope of error. The first drafts
                            are 99% error free and we trust them for all drawing
                            projects.
                          </p>
                          {/* <img
                            className="text-slide-img"
                            src="quote_image_02.jpg"
                            alt=""
                          /> */}
                          <p className="text-slide-name">Anonymous</p>
                          <p className="text-slide-position">Anonymous</p>
                        </div>
                      </Carousel>
                    </div>
                    <div className="clear"></div>
                  </div>
                </div>
                {/* </div> */}
              </div>
            </div>
          </div>

          {/* <!-- Pricing Section --> */}
          <div id="pricing" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">PRICING</h3>
            </div>
            <div className="section-wrapper block content-1170 d-flex flex-wrap justify-content-between">
              {/* <div className="content-wrapper"> */}

              <div className="one_third">
                <div className="pricing-table ">
                  {/* <p className="pricing-num">2</p> */}
                  <div className="pricing-wrapper">
                    <div className="pricing-table-header">
                      <div className="pricing-table-title">
                        Utility Patent
                        <br /> Drawings
                      </div>
                    </div>
                    <div className="pricing-table-price">$30</div>
                    <div className="pricing-table-desc">Per Drawing</div>
                    <div className="pricing-table-content-holder">
                      <ul>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Flat Fee irrespective of complexity
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Quick turn around as less as 2 days
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          100% compliance with regulations of Patent Office
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          All possible output format provided
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Free of cost iterations
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pricing-button">
                    <a href="#" className="button scroll">
                      CHOOSE PLAN
                    </a>
                  </div>
                </div>
              </div>
              <div className="one_third">
                <div className="pricing-table ">
                  {/* <p className="pricing-num">1</p> */}
                  <div className="pricing-wrapper">
                    <div className="pricing-table-header">
                      <div className="pricing-table-title">
                        Design Patent
                        <br /> Drawings
                      </div>
                    </div>
                    <div className="pricing-table-price">$40</div>
                    <div className="pricing-table-desc">Per Drawing</div>
                    <div className="pricing-table-content-holder">
                      <ul>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Flat Fee irrespective of complexity
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Quick turn around as less as 3 days
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Perfect shading guaranteed
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Help you include every possible view
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          100% compliance with regulations of Patent Office
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          All possible output format provided
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Free of cost iterations
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pricing-button">
                    <a href="#" className="button scroll">
                      CHOOSE PLAN
                    </a>
                  </div>
                </div>
              </div>
              <div className="one_third">
                <div className="pricing-table ">
                  {/* <p className="pricing-num">3</p> */}
                  <div className="pricing-wrapper">
                    <div className="pricing-table-header">
                      <div className="pricing-table-title">
                        Trademark Drawings
                      </div>
                    </div>
                    <div className="pricing-table-price">$60</div>
                    <div className="pricing-table-desc">Per Trademark</div>
                    <div className="pricing-table-content-holder">
                      <ul>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Flat Fee irrespective of complexity
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Quick turn around as less as 3 days
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          100% compliance with regulations of Patent Office
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          All possible output format provided
                        </li>
                        <li className="pricing-list included-yes">
                          <span
                            className="fa fa-check"
                            aria-hidden="true"
                          ></span>
                          Free of cost iterations
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pricing-button">
                    <a href="#" className="button scroll">
                      CHOOSE PLAN
                    </a>
                  </div>
                </div>
              </div>
              {/* <div className="clear"></div> */}
              {/* </div> */}
            </div>
          </div>

          {/* <!-- Team Section --> */}
          {/* <div id="team" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">TEAM</h3>
            </div>
            <div className="section-wrapper block content-1170 center-relative">
              <div className="content-wrapper">
                <div className="member member-left">
                  <img
                    id="team-img"
                    src="about_item_01.jpg"
                    alt=""
                    data-threshold="0 0"
                    data-jarallax-element="60 0"
                  />
                  <div className="member-info">
                    <p className="member-postition">CEO</p>
                    <h5 className="member-name">Marty Stone</h5>
                    <div className="member-content">
                      <p>
                        Code the energy hidden in matter citizens of distant
                        epochs sun. Citizens of distant epochs encyclopaedia
                        galant ctica the ash of stellar alchemy Vangelis white
                        dwarf adipisci velit. Nemo enim ipsam volupta tem quia
                        voluptas sit aspernatur aut odit aut fugit radio
                        telescope quis nostrum exercitatio nem ullam corporis
                        suscipit laboriosam quis.
                      </p>
                      <div
                        className="member-social-holder"
                        data-jarallax-element="0 30"
                      >
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-facebook"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-twitter"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-instagram"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-vimeo"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-behance"></span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <br />

                <div className="member big-screen member-right">
                  <div className="member-info">
                    <p className="member-postition">DESIGNER</p>
                    <h5 className="member-name">John Williams</h5>
                    <div className="member-content">
                      <p>
                        Code the energy hidden in matter citizens of distant
                        epochs sun. Citizens of distant epochs encyclopaedia
                        galant ctica the ash of stellar alchemy Vangelis white
                        dwarf adipisci velit. Nemo enim ipsam volupta tem quia
                        voluptas sit aspernatur aut odit aut fugit radio
                        telescope quis nostrum exercitatio nem ullam corporis
                        suscipit laboriosam quis.
                      </p>
                      <div
                        className="member-social-holder"
                        data-jarallax-element="0 -30"
                      >
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-facebook"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-twitter"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-instagram"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-vimeo"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-behance"></span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <img
                    id="team-img"
                    src="about_item_02.jpg"
                    alt=""
                    data-threshold="0 0"
                    data-jarallax-element="60 0"
                  />
                </div>

                <br />

                <div className="member member-left">
                  <img
                    id="team-img"
                    src="about_item_03.jpg"
                    alt=""
                    data-threshold="0 0"
                    data-jarallax-element="60 0"
                  />
                  <div className="member-info">
                    <p className="member-postition">DEVELOPER</p>
                    <h5 className="member-name">Vanessa Doe</h5>
                    <div className="member-content">
                      <p>
                        Code the energy hidden in matter citizens of distant
                        epochs sun. Citizens of distant epochs encyclopaedia
                        galant ctica the ash of stellar alchemy Vangelis white
                        dwarf adipisci velit. Nemo enim ipsam volupta tem quia
                        voluptas sit aspernatur aut odit aut fugit radio
                        telescope quis nostrum exercitatio nem ullam corporis
                        suscipit laboriosam quis.
                      </p>
                      <div
                        className="member-social-holder"
                        data-jarallax-element="0 30"
                      >
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-facebook"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-twitter"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-instagram"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-vimeo"></span>
                          </a>
                        </div>
                        <div className="social">
                          <a href="#" target="_blank">
                            <span className="fa fa-behance"></span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}

          {/* <!-- Skills Section --> */}
          {/* <div id="skills" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">SKILLS</h3>
            </div>
            <div className="section-wrapper block content-1170 center-relative">
              <div className="content-wrapper">
                <div className="one_half ">
                  <p className="title-description-up">OUR NUMBERS</p>
                  <h2 className="entry-title medium-text">
                    Check our <br />
                    Skills
                  </h2>
                  <p>
                    Code the energy hidden in matter citizens of distant epochs
                    from which we spring drake equation perga inconspicuous
                    motespatch clean designed code and energy matter.
                  </p>
                  <br />
                  <div className="button-holder text-left">
                    <a href="#portfolio" className="button">
                      LEARN MORE
                    </a>
                  </div>
                </div>

                <div className="one_half last">
                  <div className="skills-holder">
                    <div className="skill-holder">
                      <div className="skill-percent">75%</div>
                      <div className="skill-text">
                        <span>Creativity</span>
                        <div className="skill">
                          <div className="skill-fill" data-fill="75%"></div>
                        </div>
                      </div>
                    </div>

                    <div className="skill-holder">
                      <div className="skill-percent">45%</div>
                      <div className="skill-text">
                        <span>Cooking</span>
                        <div className="skill">
                          <div className="skill-fill" data-fill="45%"></div>
                        </div>
                      </div>
                    </div>

                    <div className="skill-holder">
                      <div className="skill-percent">90%</div>
                      <div className="skill-text">
                        <span>PhP</span>
                        <div className="skill">
                          <div className="skill-fill" data-fill="90%"></div>
                        </div>
                      </div>
                    </div>

                    <div className="skill-holder">
                      <div className="skill-percent">65%</div>
                      <div className="skill-text">
                        <span>Marketing</span>
                        <div className="skill">
                          <div className="skill-fill" data-fill="65%"></div>
                        </div>
                      </div>
                    </div>

                    <div className="skill-holder">
                      <div className="skill-percent">85%</div>
                      <div className="skill-text">
                        <span>Design</span>
                        <div className="skill">
                          <div className="skill-fill" data-fill="85%"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="clear"></div>
              </div>
            </div>
          </div> */}

          {/* <!-- Millstones Section --> */}
          <div id="millstones" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">MILESTONES</h3>
            </div>
            <div className="section-wrapper block content-1170 d-flex justify-content-center">
              <div className="content-wrapper">
                <ul className="milestones-holder">
                  <li className="milestone">
                    <div className="milestone-info-left">
                      <p className="milestone-num">100+</p>
                    </div>
                    <div className="milestone-info-right">
                      <h5>Clients served</h5>
                      <p className="milestone-text">
                        We've served more than 100+ clients who are highly
                        statisfied from the work they've received.
                      </p>
                    </div>
                  </li>

                  <li className="milestone">
                    <div className="milestone-info-left">
                      <p className="milestone-num">1500+</p>
                    </div>
                    <div className="milestone-info-right">
                      <h5>Projects delivered</h5>
                      <p className="milestone-text">
                        More than 1500+ projects delivered till by the Team.
                      </p>
                    </div>
                  </li>

                  <li className="milestone">
                    <div className="milestone-info-left">
                      <p className="milestone-num">100K</p>
                    </div>
                    <div className="milestone-info-right">
                      <h5>Client Savings</h5>
                      <p className="milestone-text">
                        Our Clients had saved more 100K $ by chosing us as there
                        option.
                      </p>
                    </div>
                  </li>

                  <li className="milestone">
                    <div className="milestone-info-left">
                      <p className="milestone-num">33+</p>
                    </div>
                    <div className="milestone-info-right">
                      <h5>U.S states clients</h5>
                      <p className="milestone-text">
                        We've got satsified clients from more than 33 states of
                        U.S.A
                      </p>
                    </div>
                  </li>
                  <li className="milestone">
                    <div className="milestone-info-left">
                      <p className="milestone-num">7+</p>
                    </div>
                    <div className="milestone-info-right">
                      <h5>Expertise in 7+ Technology areas</h5>
                      {/* <p className="milestone-text">
                      Nulla ac laoreet est, a mollis nibh. Aenean eget auctor
                      velit quis pharetra.
                    </p> */}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* <!-- Contact Section --> */}
          <div id="contact" className="section">
            <div className="page-title-holder">
              <h3 className="entry-title">CONTACT</h3>
            </div>
            <div className="section-wrapper block content-1170 d-flex">
              {/* <div className="content-wrapper"> */}
              <div className="one_half ">
                <p className="title-description-up">CONTACT US</p>
                <h2 className="entry-title medium-text">
                  Lets start <br />
                  Working
                </h2>
                <p>
                  Because they are hard, because that goal will serve to
                  organize and measure the best of our energies and skills,
                  because that challenge is one that we are willing to accept
                  one we are.
                </p>
                <br />
                <p>"Paralegal of a law firm based in New York."</p>
                <p>Email: info@patentaide.com | drawing@patentaide.com</p>
                <br />
                {/* <div className="social">
                  <a href="#" target="_blank">
                    <span className="fa fa-facebook"></span>
                  </a>
                </div>
                <div className="social">
                  <a href="#" target="_blank">
                    <span className="fa fa-twitter"></span>
                  </a>
                </div>
                <div className="social">
                  <a href="#" target="_blank">
                    <span className="fa fa-instagram"></span>
                  </a>
                </div>
                <div className="social">
                  <a href="#" target="_blank">
                    <span className="fa fa-vimeo"></span>
                  </a>
                </div>
                <div className="social">
                  <a href="#" target="_blank">
                    <span className="fa fa-behance"></span>
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ApplicationHome;
