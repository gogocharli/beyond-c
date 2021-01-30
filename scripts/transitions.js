import barba from '@barba/core';
import gsap from 'gsap';

function createTransitions() {
  // Create our wiper for the last page
  const bodyEl = document.querySelector('body');

  const wiper = document.createElement('div');
  wiper.classList.add('wiper');

  const wiperText = document.createElement('span');
  wiperText.innerText = 'B';

  wiper.appendChild(wiperText);
  bodyEl.appendChild(wiper);

  // The pages will transition in and out by a fade and move up motion
  barba.init({
    transitions: [
      {
        name: 'next',
        once({ current, next, trigger }) {
          return new Promise((resolve) => {
            const timeline = gsap.timeline({
              onComplete() {
                resolve();
              },
            });

            const elements = next.container.querySelectorAll('*');
            timeline
              .set(elements, { y: -50, opacity: 0 })
              .to(wiper, {
                y: '-100%',
                ease: 'power4.inOut',
                duration: 1.5,
              })
              .to(elements, {
                opacity: 1,
                y: 0,
                stagger: 0.075,
                ease: 'sine',
              });
          });
        },
        leave({ current, next, trigger }) {
          return new Promise((resolve) => {
            const timeline = gsap.timeline({
              onComplete() {
                current.container.remove();
                resolve();
              },
            });

            // Select all the direct children of the container
            const elements = current.container.querySelectorAll('*');

            timeline
              // Reset the wiper position to the bottom of the document
              .set(wiper, { y: '100%' })
              .to(
                elements,
                { opacity: 0, y: -50, ease: 'sine', stagger: 0.05 },
                1,
              )
              .to(wiper, { y: 0 }, 2);
          });
        },
        beforeEnter({ current, next, trigger }) {
          return new Promise((resolve) => {
            const timeline = gsap.timeline({
              onComplete() {
                resolve();
              },
            });

            const elements = next.container.querySelectorAll('*');
            // Allow the the wiper to stay on screen for one and a half seconds
            timeline
              .set(elements, { y: -50, opacity: 0 })
              .to(wiper, { duration: 1, x: 0 });
          });
        },
        enter({ current, next, trigger }) {
          return new Promise((resolve) => {
            const timeline = gsap.timeline({
              onComplete() {
                resolve();
              },
            });

            const elements = next.container.querySelectorAll('*');

            timeline.to(wiper, { y: '-100%' }).to(elements, {
              opacity: 1,
              y: 0,
              stagger: 0.075,
              ease: 'sine',
            });
          });
        },
      },
    ],
    views: [],
    debug: true,
  });
}

export { createTransitions };
