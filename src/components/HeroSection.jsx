import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

import '../styles/base.css';
import mainImage from '../assets/images/sakura.png';

export default function HeroSection() {

    const targetRef = useRef(null);
    const targetRefDivHeader = useRef(null);
    const controls = useAnimation();

    const [imgAddClassShrink, setimgAddClassShrink] = useState(false);
    const [imgDisplayNone, setImageDisplayNone] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (!targetRef.current || !targetRefDivHeader.current ) return;
            //console.log('Ref Header - Hight top: ' + targetRefDivHeader.current.getBoundingClientRect().top + 'hight bottom: ' + targetRefDivHeader.current.getBoundingClientRect().bottom)
            //console.log('Ref img - popular' + targetRef.current.getBoundingClientRect().top)
            //const targetTop = targetRef.current.getBoundingClientRect().top + window.scrollY;
            const targetTop = targetRef.current.getBoundingClientRect().top;
            const headerBottom = targetRefDivHeader.current.getBoundingClientRect().bottom;
            //const scrollY = window.scrollY;
            //const offset = 30;

            //console.log('scroll: ' + window.scrollY)
            //console.log('targetRef + scroll: ' + targetTop)

            if (targetTop <=0 && headerBottom <= 90){
                controls.start({
          scale: 0.5,
          y: 200,
          opacity: 0,
          transition: { duration: 0.8, ease: 'easeInOut' },
        });
            
              //  setImageDisplayNone(true);
               // setimgAddClassShrink(true);

            } else {
               controls.start({
          scale: 1,
          y: 0,
          opacity: 1,
          transition: { duration: 0.8, ease: 'easeOut' },
        });

            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    //Classe montada com base nos estados
    const imgClassName = `  ${imgAddClassShrink ? 'floating-image shrink' : ''} ${imgDisplayNone ? 'floating-image display-none' : ''}`;

    return (
        <div className="main-section" >
            <header className='first-section' >
                <section ref={targetRefDivHeader}>
                    <h1>YOLK TH</h1>
                    <motion.img
          src={mainImage}
          alt="main image"
          className="main-image"
          animate={controls}
          initial={{ opacity: 0, scale: 0.8, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
                   {/* 
                        <h2>MENU</h2>
                        <div className="scroll-indicator">Scroll ↓</div> 
                    */}
                </section>


                <section className="popular-section">
                    <h3 className='sub-title' >popular</h3 >

                    <div className="popular-section-images">
                        <div className="popular-section-images-item" ref={targetRef}>
                            <p>Misto quente</p>
                                <img src={mainImage} alt="popular dish" />
                            <span>R$ 21,00</span>
                        </div>

                        <div className="popular-section-images-item">
                            <p>Panqueca doce</p>
                            <img src={mainImage} alt="main image" />
                            <span>R$ 21,00</span>
                        </div>

                        <div className="popular-section-images-item">
                            <p>Avocado toast</p>
                            <img src={mainImage} alt="main image" />
                            <span>R$ 21,00</span>
                        </div>
                    </div>
                </section>

            </header>

            <div className="second-section">
                <section className='filters'>
                    <span> search by name</span>
                    <span>Prices</span>
                    <span>Category</span>
                </section>

                <section className="menu-list">
                        <h3 className='sub-title'> Category Name</h3>
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="menu-list-item">
                                <div className="menu-list-highlight-image">
                                    <img src={mainImage} alt="main image" />
                                </div>
                                <div>
                                    <p>Macarrão ao molho</p>
                                    <p>R$ 12,00</p>
                                    <p>macarrão, molho, tomate, alho e óleo</p>
                                </div>
                                
                            </div>
                        ))}
                </section>
            </div>
        </div>
    );
}
