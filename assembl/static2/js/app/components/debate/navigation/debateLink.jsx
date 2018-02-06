// @flow
import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { I18n } from 'react-redux-i18n';

import Timeline, { type PhaseData } from './timeline';

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
  timelineActive: boolean,
  activePhaseMenu: PhaseData
};

class DebateLink extends React.Component<*, DebateLinkProps, DebateLinkState> {
  state = {
    timelineActive: false,
    activePhaseMenu: { id: '', title: '' }
  };

  timeline = null;

  showTimeline = (event: SyntheticMouseEvent<>) => {
    this.setState({ timelineActive: true });
    if (this.props.screenTooSmall) event.preventDefault();
  };

  hideTimeline = () => {
    this.setState({ timelineActive: false });
  };

  onMenuShown = (phase: PhaseData) => {
    this.setState({ activePhaseMenu: phase });
  };

  onMenuClosed = () => {
    this.setState({ activePhaseMenu: { id: '', title: '' } });
  };

  closeMenu = () => {
    const { activePhaseMenu } = this.state;
    const menuActive = !!activePhaseMenu.id;
    this.setState({ timelineActive: menuActive, activePhaseMenu: { id: '', title: '' } }, () => {
      if (menuActive && this.timeline) this.timeline.getWrappedInstance().closeMenu();
    });
  };

  render() {
    const { identifier, children, to, className, activeClassName, dataText, screenTooSmall } = this.props;
    const { timelineActive, activePhaseMenu } = this.state;
    const currentPhaseTitle = activePhaseMenu.title;
    return (
      <div
        className={classNames('debate-link', { active: timelineActive })}
        onMouseOver={!screenTooSmall && this.showTimeline}
        onMouseLeave={!screenTooSmall && this.hideTimeline}
      >
        {screenTooSmall && (
          <div className="menu-back-container">
            {timelineActive && (
              <div onClick={this.closeMenu} className="menu-back-btn">
                <span className="assembl-icon assembl-icon-left-small" />
                <span className="title">{I18n.t('debate.menuBack')}</span>
              </div>
            )}
          </div>
        )}
        <Link
          to={to}
          className={classNames('debate-link-title', className, { selected: timelineActive })}
          activeClassName={activeClassName}
          data-text={dataText}
        >
          <span className={screenTooSmall && 'title-container'}>
            {children}
            {screenTooSmall &&
              currentPhaseTitle && (
                <span className="phase-title">
                  <span className="assembl-icon assembl-icon-right-dir" />
                  <span>{currentPhaseTitle}</span>
                </span>
              )}
          </span>
          {screenTooSmall &&
            !timelineActive && <span onClick={this.showTimeline} className="thumb-arrow assembl-icon assembl-icon-right-dir" />}
        </Link>
        <div className={classNames('header-container', { integreted: screenTooSmall })}>
          <section className={classNames('timeline-section', { vertical: screenTooSmall })} id="timeline">
            <div className="max-container">
              <Timeline
                ref={(timeline) => {
                  this.timeline = timeline;
                }}
                vertical={screenTooSmall}
                showNavigation
                identifier={identifier}
                onMenuItemClick={this.hideTimeline}
                onMenuShown={screenTooSmall && this.onMenuShown}
                onMenuClosed={screenTooSmall && this.onMenuClosed}
              />
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default DebateLink;