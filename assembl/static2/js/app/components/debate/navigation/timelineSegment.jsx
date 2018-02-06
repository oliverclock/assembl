// @flow
import React from 'react';
import { withApollo, type ApolloClient } from 'react-apollo';
import { browserHistory } from 'react-router';
import { Translate, Localize, I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import classNames from 'classnames';

import Menu, { prefetchMenuQuery } from './menus/menu';
import { getPhaseStatus, isSeveralIdentifiers, type Timeline } from '../../../utils/timeline';
import { displayModal } from '../../../utils/utilityManager';
import { get } from '../../../utils/routeMap';
import { PHASE_STATUS } from '../../../constants';
import { MENU_KINDS } from './menus';

export type DebateType = {
  debateData: {
    timeline: Timeline,
    slug: string
  }
};

type TimelineSegmentProps = {
  index: number,
  client: ApolloClient,
  title: {
    entries: Array<*>
  },
  startDate: string,
  endDate: string,
  phaseIdentifier: string,
  debate: DebateType,
  barPercent: number,
  isCurrentPhase: boolean,
  isStepCompleted: boolean,
  locale: string,
  vertical: boolean,
  onMenuItemClick: Function,
  onShowMenu: Function,
  onHideMenu: Function
};

type TimelineSegmentState = {
  active: boolean
};

export class DumbTimelineSegment extends React.Component<*, TimelineSegmentProps, TimelineSegmentState> {
  state = {
    active: false
  };

  componentWillMount() {
    const { phaseIdentifier, title, startDate, endDate, locale, client } = this.props;
    this.phaseStatus = getPhaseStatus(startDate, endDate);
    let phaseName = '';
    let phaseTitle = '';
    title.entries.forEach((entry) => {
      if (locale === entry['@language']) {
        phaseTitle = entry.value;
        phaseName = entry.value.toLowerCase();
      }
    });
    this.phaseName = phaseName;
    this.phaseTitle = phaseTitle;
    prefetchMenuQuery(client, {
      lang: locale,
      identifier: phaseIdentifier
    });
  }

  componentWillReceiveProps() {
    if (this.state.active) {
      this.setState({ active: false });
    }
  }

  phaseStatus = null;

  phaseName = null;

  phaseTitle = null;

  showMenu = (event: SyntheticMouseEvent<>) => {
    this.setState({ active: true }, () => {
      const { onShowMenu, phaseIdentifier } = this.props;
      if (onShowMenu) onShowMenu({ id: phaseIdentifier, title: this.phaseTitle });
    });
    if (this.props.vertical && event) event.preventDefault();
  };

  hideMenu = () => {
    this.setState({ active: false }, () => {
      const { onHideMenu } = this.props;
      if (onHideMenu) onHideMenu();
    });
  };

  close = () => {
    this.setState({ active: false });
  };

  renderNotStarted = (className?: string) => {
    const { startDate } = this.props;
    return (
      <div className={className}>
        <Translate value="debate.notStarted" phaseName={this.phaseName} />
        <Localize value={startDate} dateFormat="date.format" />
      </div>
    );
  };

  displayPhase = () => {
    const { phaseIdentifier } = this.props;
    const { debateData } = this.props.debate;
    const phase = debateData.timeline.filter(p => p.identifier === phaseIdentifier);
    const isRedirectionToV1 = phase[0].interface_v1;
    const slug = { slug: debateData.slug };
    const params = { slug: debateData.slug, phase: phaseIdentifier };
    const isSeveralPhases = isSeveralIdentifiers(debateData.timeline);
    if (isSeveralPhases) {
      if (this.phaseStatus === PHASE_STATUS.notStarted) {
        const body = this.renderNotStarted();
        displayModal(null, body, true, null, null, true);
      }
      if (this.phaseStatus === PHASE_STATUS.inProgress || this.phaseStatus === PHASE_STATUS.completed) {
        if (!isRedirectionToV1) {
          browserHistory.push(get('debate', params));
          this.hideMenu();
        } else {
          const body = <Translate value="redirectToV1" phaseName={this.phaseName} />;
          const button = { link: get('oldDebate', slug), label: I18n.t('home.accessButton'), internalLink: false };
          displayModal(null, body, true, null, button, true);
          setTimeout(() => {
            window.location = get('oldDebate', slug);
          }, 6000);
        }
      }
    } else if (!isRedirectionToV1) {
      browserHistory.push(get('debate', params));
      this.hideMenu();
    } else {
      window.location = get('oldDebate', slug);
    }
  };

  renderMenu = () => {
    const { phaseIdentifier, onMenuItemClick, vertical } = this.props;
    const { active } = this.state;
    const isNotStarted = this.phaseStatus === PHASE_STATUS.notStarted;
    if (!active) return null;
    return (
      <div className="menu-container">
        {isNotStarted ? (
          this.renderNotStarted('not-started')
        ) : (
          <Menu
            identifier={phaseIdentifier}
            onMenuItemClick={onMenuItemClick}
            kind={vertical ? MENU_KINDS.index : MENU_KINDS.table}
          />
        )}
      </div>
    );
  };

  render() {
    const { index, barPercent, isCurrentPhase, isStepCompleted, vertical } = this.props;
    const { active } = this.state;
    const timelineClass = classNames('timeline-title', {
      'txt-active-bold': vertical && isCurrentPhase,
      'txt-active-light': !vertical || (vertical && isStepCompleted),
      'txt-not-active': vertical && !isCurrentPhase && !isStepCompleted
    });
    const complitedOrCurrent = isStepCompleted || isCurrentPhase;
    const dimensionName = vertical ? 'height' : 'width';
    if (vertical && active) return this.renderMenu();
    return (
      <div
        className={classNames('minimized-timeline', {
          active: active
        })}
        onMouseOver={!vertical && this.showMenu}
        onMouseLeave={!vertical && this.hideMenu}
        onClick={vertical && this.showMenu}
      >
        <div onClick={this.displayPhase} className={timelineClass}>
          <div className="timeline-link">{this.phaseTitle}</div>
          {vertical && (
            <div className="timeline-link-description">
              {isStepCompleted && I18n.t('debate.phaseCompleted')}
              {isCurrentPhase && I18n.t('debate.phaseStarted')}
              {!complitedOrCurrent && I18n.t('debate.phaseUpcoming')}
            </div>
          )}
        </div>
        <div className="timeline-graph">
          {vertical && (
            <div
              className={classNames('timeline-number', {
                active: complitedOrCurrent,
                'not-active': !complitedOrCurrent,
                'timeline-text': !isStepCompleted
              })}
            >
              {isStepCompleted ? (
                <span className="assembl-icon-checked white" />
              ) : (
                <span>
                  {isCurrentPhase && <span className="thumb-arrow assembl-icon assembl-icon-right-dir" />}
                  {index + 1}
                </span>
              )}
            </div>
          )}
          <div className="timeline-bars">
            {barPercent > 0 && (
              <div
                className="timeline-bar-filler"
                style={barPercent < 20 ? { [dimensionName]: '20%' } : { [dimensionName]: `${barPercent}%` }}
              >
                &nbsp;
              </div>
            )}
            <div className="timeline-bar-background">&nbsp;</div>
          </div>
        </div>
        {!vertical && active && <span className="timeline-arrow" />}
        {this.renderMenu()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locale: state.i18n.locale,
  debate: state.debate
});

// $FlowFixMe
export default connect(mapStateToProps, null, null, { withRef: true })(withApollo(DumbTimelineSegment, { withRef: true }));