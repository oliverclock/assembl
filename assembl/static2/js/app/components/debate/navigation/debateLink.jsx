// @flow
import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

import Timeline from './timeline';
import Slide from '../../common/transitions/slide';

type DebateLinkProps = {
  identifier: string,
  className: string,
  activeClassName: string,
  children: Array<*>,
  to: string,
  dataText: string,
  screenTooSmall: boolean
};

type DebateLinkState = {
  timelineActive: boolean
};

function DivContainer({ children, className }) {
  return <div className={className}>{children}</div>;
}

function SlideContainer({ children, className, active }) {
  return (
    <Slide in={active} className={className}>
      {children}
    </Slide>
  );
}

function TimelineContainer({ title, identifier, small, active, onMenuItemClick, onClose }) {
  const Container = small ? SlideContainer : DivContainer;
  return (
    <Container active={active} className={classNames('timeline-menu-container', { small: small })}>
      <section className={classNames('timeline-section', { vertical: small })} id="timeline">
        <div className="max-container">
          <Timeline title={title} vertical={small} identifier={identifier} onMenuItemClick={onMenuItemClick} onClose={onClose} />
        </div>
      </section>
    </Container>
  );
}

class DebateLink extends React.Component<*, DebateLinkProps, DebateLinkState> {
  state = {
    timelineActive: false
  };

  showTimeline = (event: SyntheticMouseEvent<>) => {
    this.setState({ timelineActive: true });
    if (this.props.screenTooSmall) event.preventDefault();
  };

  hideTimeline = () => {
    this.setState({ timelineActive: false });
  };

  render() {
    const { identifier, children, to, className, activeClassName, dataText, screenTooSmall } = this.props;
    const { timelineActive } = this.state;
    return (
      <div
        className={classNames('debate-link', { active: timelineActive })}
        onMouseOver={!screenTooSmall && this.showTimeline}
        onMouseLeave={!screenTooSmall && this.hideTimeline}
      >
        <Link
          to={to}
          className={classNames('debate-link-title', className, { selected: timelineActive })}
          activeClassName={activeClassName}
          data-text={dataText}
        >
          <span>{children}</span>
          {screenTooSmall && <span onClick={this.showTimeline} className="thumb-arrow assembl-icon assembl-icon-right-dir" />}
        </Link>
        <TimelineContainer
          title={children}
          identifier={identifier}
          small={screenTooSmall}
          active={timelineActive}
          onMenuItemClick={this.hideTimeline}
          onClose={this.hideTimeline}
        />
      </div>
    );
  }
}

export default DebateLink;