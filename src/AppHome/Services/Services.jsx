import React from 'react';
import HomeNavBar from '../AppHomeNavBar/AppHomeNavBar';
import './Services.css'

const Services = () =>{
    const content = [
        {
            title:'Utility Patent Drawings',
            desc: 'PatentAide specializes in creation of high quality Utility Drawings for Patent applications.',
            subHeading1: 'Types',
            subHeading1Desc: ['Electrical Devices',
                'Mechanical Devices',
                'UI Designs',
                'Medical Schematics',
                'Chemical Structures',
                'Waveforms',
                'Virtual Reality Environment',
                'Flow Charts',
                'Graphs',
                'Block Diagrams',
                'Geographical Maps'
                ],
            subHeading2: 'Utility Drawing Views',
            subHeading2Desc: [
                'Orthogonal View',
                'Perspective View',
                'Alternate Position View',
                'Sectional View',
                'Isometric View',
                'Enlarged View',
                'Exploded View',
                'Partial View'
            ],
            subHeading3: 'Types of Lines Used',
            subHeading3Desc: [
                'Solid Lines- It represents claimed portion of design drawing',
                'Phantom Lines- It shows disclaimed portion of design drawing',
                'Hidden Lines- It is dashed lines which represent line obstructed by another device or embodiment',
                'Projected Lines- These lines represents detached part from other embodiments',
                'Boundary Lines- Boundary lines are used to design patents to separate disclaimed areas',

            ]
        },
        {
            title:'Design Patent Drawings',
            desc:'We render perfect shadings to your design drawings and help you include every possible view of the invention',
            subHeading1:'Design Drawing Views',
            subHeading1Desc:[
                'Sectional Views',
                'Standard Views',
                'Exploded Views',
                'Isometric Views',
                'Enlarged Views',
                'Movable Parts',
            ],
            subHeading2: 'Design Drawing Shadings',
            subHeading2Desc: [
                'Straight Like Surface Shading',
                'Stippling',
                'Combination of Straight-Line Shading and Stippling',
            ]
        },
        {
            title:'Trademark Drawings',
            desc:'Protect your brand with accurate and meaningful drawings',
            subHeading1: 'Types',
            subHeading1Desc:[
                'Standard Character Drawing',
                'Special Form Drawing',
            ]

        }
    ]
    return(
        <div className="hero">
                <HomeNavBar />
                <div className='service-header'>
                    Services
                </div>
                <div className='service-main-content-wrapper block d-flex'>
                    {content?.map((data,index)=>(
                        <div className='service-details'>
                            <div className='service-details-wrapper'>
                                <div className='service-num'>{index+1}</div>
                                <h4 className='title'>{data?.title}</h4>
                                <p className='description'>{data?.desc}</p>
                                <div className='service-details-content'>
                                    <div className='d-flex'>
                                        <div className='subheading-bullet-wrapper'> <div className='subheading-bullet'/></div>
                                    <div className='subheading'>{data?.subHeading1}</div>
                                    </div>
                                    <div className='details'>
                                        {data?.subHeading1Desc?.map(data=>(
                                            <div className='d-flex'>
                                                <div className='empty-bullet-container'><div className='empty-bullet'/></div>
                                                <div className='subheading-detail'>{data} </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {data?.subHeading2 && <div className='service-details-content'>
                                    <div className='d-flex'>
                                        <div className='subheading-bullet-wrapper'> <div className='subheading-bullet'/></div>
                                    <div className='subheading'>{data?.subHeading2}</div>
                                    </div>
                                    <div className='details'>
                                        {data?.subHeading2Desc?.map(data=>(
                                            <div className='d-flex'>
                                                <div className='empty-bullet-container'><div className='empty-bullet'/></div>
                                                <div className='subheading-detail'>{data} </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>}
                                {data?.subHeading3 && <div className='service-details-content'>
                                    <div className='d-flex'>
                                        <div className='subheading-bullet-wrapper'> <div className='subheading-bullet'/></div>
                                    <div className='subheading'>{data?.subHeading3}</div>
                                    </div>
                                    <div className='details'>
                                        {data?.subHeading3Desc?.map(data=>(
                                            <div className='d-flex'>
                                                <div className='empty-bullet-container'><div className='empty-bullet'/></div>
                                                <div className='subheading-detail'>{data} </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>}
                            </div>
                        </div>
                    ))}
                </div>
        </div>
    )
}

export default Services;