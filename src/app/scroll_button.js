import React, {useState} from 'react'; 

const ScrollButton = () =>{ 
  
    const [visible, setVisible] = useState(false) 
    
    const toggleVisible = () => { 
      const scrolled = document.documentElement.scrollTop; 
      if (scrolled > 300){ 
        setVisible(true) 
      }  
      else if (scrolled <= 300){ 
        setVisible(false) 
      } 
    }; 
    
    const scrollToTop = () =>{ 
      window.scrollTo({ 
        top: 0,  
        behavior: 'smooth'
      }); 
    }; 
    
    window.addEventListener('scroll', toggleVisible); 
    
    return ( 
      <button type="button" onClick={scrollToTop} style={{display: visible ? 'inline' : 'none', position: "fixed", bottom: "2em", right: "2em" }} > 
      ↑
      </button> 
    ); 
  } 
    
  export default ScrollButton; 
  