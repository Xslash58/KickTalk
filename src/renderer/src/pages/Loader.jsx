import React, { useEffect, useState } from "react";
import "../assets/styles/loader.css";
import Klogo from "../assets/icons/K.svg";

const Loader = ({ onFinish }) => {
  const [showText, setShowText] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 100);
    const finishTimer = setTimeout(() => {
      setHideLoader(true);
      setTimeout(onFinish, 1000);
    }, 1500);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div className={`loaderContainer ${hideLoader ? "slideUp" : ""}`}>
      <div className={`logoWrapper ${hideLoader ? "logoWrapperFadeOut" : ""}`}>
        <img src={Klogo} alt="Loader Logo" width={200} height={200} className="logoImage" />
      </div>
      {showText && (
        <p className="creatorText">
          Created by <span>DRKNESS</span> and <span>ftk789</span>
        </p>
      )}
    </div>
  );
};

export default Loader;
