import React, { useState, useRef, useEffect } from "react";
import styles from "./index.css";
import mojs from "mo-js";

const MAX_CLAPS = 50;

// no animation logic here
const MediumClap = ({ animate }) => {
  const [state, setState] = useState({
    count: 0,
    total: 550,
  });

  const [isClicked, setIsClicked] = useState(false);

  const onClick = (event) => {
    setState((prevState) =>
      prevState.count >= MAX_CLAPS ? prevState : { count: prevState.count + 1, total: prevState.total + 1 }
    );
    setIsClicked(true);
    animate();
  };
  return (
    <button id="clap" className={styles.clap} onClick={onClick}>
      <ClapIcon isClicked={isClicked} />
      <ClapCount count={state.count} />
      <CountTotal countTotal={state.total} />
    </button>
  );
};

/**
 * subcomponents
 */

const ClapIcon = ({ isClicked = false }) => {
  return (
    <span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-549 338 100.1 125"
        className={`${styles.icon} ${isClicked && styles.checked}`}
      >
        <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
        <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
      </svg>
    </span>
  );
};
const ClapCount = ({ count = 0 }) => {
  return (
    <span id="count" className={styles.count}>
      + {count}
    </span>
  );
};

const CountTotal = ({ countTotal = 250 }) => {
  return (
    <span id="countTotal" className={styles.total}>
      {countTotal}
    </span>
  );
};

// higher order components
/* HOC takes a component and returns enhanced version of it */
// clap animation hoc
const WithClapAnimation = (WrappedComponent = <></>, props = {}) => {
  const animationTimelineRef = useRef(new mojs.Timeline());

  const createScaleEffect = () => {
    return new mojs.Html({
      el: "#clap",
      duration: 300,
      scale: { 1.3: 1 },
      easing: mojs.easing.ease.out,
    });
  };

  const createCountTotalAnimation = () => {
    return new mojs.Html({
      el: "#countTotal",
      opacity: { 0: 1 },
      delay: (3 * 300) / 2,
      duration: 300,
      y: { 0: -3 },
    });
  };

  const createCountAnimation = () => {
    return new mojs.Html({
      el: "#count",
      opacity: { 0: 1 },
      duration: 300,
      y: { 0: -30 },
    }).then({
      opacity: { 1: 0 },
      y: -80,
      delay: 300 / 2,
    });
  };

  const createTriangleBurstAnimation = () => {
    return new mojs.Burst({
      parent: "#clap",
      radius: { 50: 95 },
      count: 5,
      angle: 30,
      children: {
        shape: "polygon",
        radius: { 6: 0 },
        stroke: "rgba(211, 54, 0, 0.5)",
        strokeWidth: 2,
        angle: 210,
        speed: 0.2,
        delay: 30,
        duration: 300,
      },
    });
  };

  const createCircleBurstAnimation = () => {
    return new mojs.Burst({
      parent: "#clap",
      radius: { 50: 75 },
      count: 5,
      angle: 25,
      duration: 300,
      children: {
        shape: "circle",
        radius: { 3: 0 },
        fill: "rgba(149, 165 166, 0.5)",
        speed: 0.2,
        delay: 30,
      },
    });
  };

  useEffect(() => {
    const scaleEffect = createScaleEffect();
    const countTotalAnimation = createCountTotalAnimation();
    const countAnimation = createCountAnimation();
    const triangleBurstAnimation = createTriangleBurstAnimation();
    const circleBurstAnimation = createCircleBurstAnimation();
    animationTimelineRef.current.add([
      scaleEffect,
      countTotalAnimation,
      countAnimation,
      triangleBurstAnimation,
      circleBurstAnimation,
    ]);

    const element = document.getElementById("clap");
    element.style.transform = "scale(1,1)";
  }, []);

  const animate = () => {
    animationTimelineRef.current.replay();
  };

  return <WrappedComponent {...props} animate={animate} />;
};

// usage
const Usage = () => {
  return (
    <>
      {WithClapAnimation(MediumClap)}
      <p>Animated via HOC</p>
    </>
  );
};

export default Usage;
