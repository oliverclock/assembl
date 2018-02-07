// @flow
import React from 'react';
import Transition from 'react-transition-group/Transition';
import { ANIMATION_DURATION } from '../../../constants';

const defaultStyle = {
  transition: `all ${ANIMATION_DURATION}ms cubic-bezier(.145, .82, .34, 1.015)`,
  transform: 'translateX(100%)'
};

const transitionStyles = {
  entering: { transform: 'translateX(100%)' },
  entered: { transform: 'translateX(0%)' }
};

type SlideProps = {
  in: boolean,
  children: Array<*>,
  className: string,
  onExited?: Function
};

const Slide = (props: SlideProps) => {
  const { in: inProp, children, className, onExited } = props;
  return (
    <Transition in={inProp} timeout={ANIMATION_DURATION} onExited={onExited}>
      {state => (
        <div
          className={className}
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
        >
          {children}
        </div>
      )}
    </Transition>
  );
};

Slide.defaultProps = {
  onExited: undefined
};

export default Slide;