// @flow
import React from 'react';
import { withApollo, type ApolloClient } from 'react-apollo';
import { browserHistory } from 'react-router';
import { Translate, Localize, I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { prefetchMenuQuery } from './menus/menu';
import { getPhaseStatus, isSeveralIdentifiers, type Timeline, type Phase } from '../../../utils/timeline';
import { displayModal } from '../../../utils/utilityManager';
import { get } from '../../../utils/routeMap';
import { PHASE_STATUS } from '../../../constants';
import TimelineMenu from './timelineMenu';

export type DebateType = {
  debateData: {
    timeline: Timeline,
    slug: string
  }
};

type TimelineSegmentProps = {
  index: number,
  client: ApolloClient,
  phase: Phase,
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
    const { phase: { identifier, title, start, end }, locale, client } = this.props;
    this.phaseStatus = getPhaseStatus(start, end);
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
      identifier: identifier
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

  showMenu = () => {
    this.setState({ active: true }, () => {
      const { onShowMenu, phase } = this.props;
      if (onShowMenu) onShowMenu(phase);
    });
  };

  hideMenu = () => {
    this.setState({ active: false }, () => {
      const { onHideMenu } = this.props;
      if (onHideMenu) onHideMenu();
    });
  };

  renderNotStarted = (className?: string) => {
    const { phase: { start } } = this.props;
    return (
      <div className={className}>
        <Translate value="debate.notStarted" phaseName={this.phaseName} />
        <Localize value={start} dateFormat="date.format" />
      </div>
    );
  };

  displayPhase = () => {
    const { phase } = this.props;
    const { debateData } = this.props.debate;
    const isRedirectionToV1 = phase.interface_v1;
    const slug = { slug: debateData.slug };
    const params = { slug: debateData.slug, phase: phase.identifier };
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

  render() {
    const { index, phase, onMenuItemClick, barPercent, isCurrentPhase, isStepCompleted, vertical } = this.props;
    const { active } = this.state;
    const timelineClass = classNames('timeline-title', {
      'txt-active-bold': vertical && isCurrentPhase,
      'txt-active-light': !vertical || (vertical && isStepCompleted),
      'txt-not-active': vertical && !isCurrentPhase && !isStepCompleted
    });
    const complitedOrCurrent = isStepCompleted || isCurrentPhase;
    const dimensionName = vertical ? 'height' : 'width';
    return (
      <div
        className={classNames('minimized-timeline', {
          active: !vertical && active
        })}
        onMouseOver={!vertical && this.showMenu}
        onMouseLeave={!vertical && this.hideMenu}
      >
        <div onClick={vertical ? this.showMenu : this.displayPhase} className={timelineClass}>
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
        {!vertical &&
          active && (
            <div>
              <span className="timeline-arrow" />
              <TimelineMenu phase={phase} onMenuItemClick={onMenuItemClick} />
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locale: state.i18n.locale,
  debate: state.debate
});

// $FlowFixMe
export default connect(mapStateToProps)(withApollo(DumbTimelineSegment));