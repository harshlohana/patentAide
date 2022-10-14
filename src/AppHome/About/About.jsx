import React from 'react';
import HomeNavBar from '../AppHomeNavBar/AppHomeNavBar';
import './About.css';


function ApplicationAboutUs() {

    const content = {
        main:'A patent drawing company that visualizes your abstract ideas and turns them into well sketched drawings.',
        para1:{
            heading: 'A little background on PatentAide:',
            text: '<p>We started with a vision to revolutionize the patent drawings industry by utilizing technology to enhance user experience and taking the hassle out for our customers.</p>',
        },
        para2:{
            heading: 'How we became what we are:',
            text: `<p>The world is ruled by technology that makes our lives easy and yet till date the patent drawings outsourcing industry is still being operated like the old-fashioned way.
                    <br/><br/> We understood the need of our clients to have privacy and least human interaction while getting the job done perfectly. 
                    So, we started on a mission to transform the industry and save our clients from phony salutations and greedy conversations of the drawing companies.<br/><br/>
                    At PatentAide, we provide you with a backend software interface for the whole lifecycle ranging from placing the order to receiving the patent drawings. 
                    And if you do need us, we are just an e-mail away.</br><br/>
                    We know that the idea still is very raw but we hope to improve upon it with your support and feedback. I am sure that you will see what we at PatentAide are trying to do and help us get there.
                    `
        },
        para3: {
            heading: 'Why us?',
            text: [
                '<p>Technology driven team aiming to make your work easier.</p>',
                '<p>Strict Adherence to Rules & Guidelines.</p>',
                '<p>Young start up with a vision to revolutionize the industry.</p>',
                '<p>Premium Quality or nothing.</p>',
                '<p>Quick Turn Around (Available 24/7).</p>',
                '<p>No Clutter, just Work.</p>',
                '<p>Experienced team of Patent Agents/Attorneys for in-depth review.</p>',
                '<p>At least 3 set of eyes on each case.</p>',
                '<p>No extra cost for Iterations.</p>',
                '<p>Experienced USPTO drawing drafters</p>',
            ]
        }

    }

    const getTitleComponent = (title)=>{
        return <div className='about-us-heading'>
            {title}
        </div>
    }

    const getTextComponent = (text) => {
        return <div className='about-us-text' dangerouslySetInnerHTML={{__html: text}}/>
    }

    return (
        <>
            <div className="hero">
                <HomeNavBar />
                <div className='about-us-header'>
                    About Us
                </div>
                <div className='main-content-wrapper'>
                    <div className='about-us-main-content'>{content.main}</div>
                    <div>
                        {getTitleComponent(content.para1.heading)}
                        {getTextComponent(content.para1.text)}
                    </div>
                    <div>
                        {getTitleComponent(content.para2.heading)}
                        {getTextComponent(content.para2.text)}
                    </div>
                    <div>
                        {getTitleComponent(content.para3.heading)}
                        <div>
                            {content.para3.text.map((text)=>
                            <div className='d-flex' key={text}>
                                <div className='bullet-point-wrapper'><div className='bullet-point'/></div>
                                <div>{getTextComponent(text)}</div>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}


export default ApplicationAboutUs;