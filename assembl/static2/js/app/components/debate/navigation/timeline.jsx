// @flow
import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import classNames from 'classnames';

import { isCurrentPhase, getBarPercent, isStepCompleted, type Phase } from '../../../utils/timeline';
import TimelineSegment, { type DebateType } from './timelineSegment';
import TimelineMenu from './timelineMenu';
import Slide from '../../common/transitions/slide';

type TimelineProps = {
  title: string,
  debate: DebateType,
  identifier: string,
  vertical: boolean,
  locale: string,
  onMenuItemClick: Function,
  onClose: Function
};

type TimelineState = {
  menuItemOpen: boolean,
  selectedPhase: Phase | null
};

function TimeLineHeader({ title, currentPhase, onBack, locale }) {
  let phaseTitle = '';
  if (currentPhase) {
    currentPhase.title.entries.forEach((entry) => {
      if (locale === entry['@language']) {
        phaseTitle = entry.value;
      }
    });
  }
  return (
    <div className="timeline-header">
      <div className="menu-back-container">
        <div onClick={onBack} className="menu-back-btn">
          <span className="assembl-icon assembl-icon-left-small" />
          <span className="title">{I18n.t('debate.menuBack')}</span>
        </div>
      </div>

      <span className="title-container">
        <span>{title}</span>
        {phaseTitle && (
          <span className="phase-title">
            <span className="assembl-icon assembl-icon-right-dir" />
            <span>{phaseTitle}</span>
          </span>
        )}
      </span>
    </div>
  );
}

export class DumbTimeline extends React.Component<*, TimelineProps, TimelineState> {
  state = {
    menuItemOpen: false,
    selectedPhase: null
  };

  onShowMenu = (phase: Phase) => {
    this.setState({ selectedPhase: phase, menuItemOpen: true });
  };

  onHideMenu = () => {
    this.setState({ selectedPhase: null, menuItemOpen: false });
  };

  onBack = () => {
    const { onClose, vertical } = this.props;
    const { selectedPhase } = this.state;
    const hasCurrentPhase = !!selectedPhase;
    if (vertical) {
      if (hasCurrentPhase) {
        // first time we close the menu with her content
        // we need this for the slide transition ==> see onTimeLineMenuExited
        this.setState({ menuItemOpen: false });
      } else if (onClose) onClose();
    } else {
      this.setState({ selectedPhase: null, menuItemOpen: false }, () => {
        if (!hasCurrentPhase && onClose) onClose();
      });
    }
  };

  onTimeLineMenuExited = () => {
    // we remove the current phase
    this.setState({ selectedPhase: null });
  };

  render() {
    const { debateData } = this.props.debate;
    const { identifier, onMenuItemClick, vertical, title, locale } = this.props;
    const { selectedPhase, menuItemOpen } = this.state;
    return (
      <div className="timeline-panel">
        {vertical && <TimeLineHeader title={title} currentPhase={selectedPhase} locale={locale} onBack={this.onBack} />}
        <div className="timeline-body">
          <div className={classNames('timeline-container', { vertical: vertical })}>
            {debateData.timeline &&
              debateData.timeline.map((phase, index) => (
                <TimelineSegment
                  key={index}
                  index={index}
                  identifier={identifier}
                  phase={phase}
                  vertical={vertical}
                  isStepCompleted={isStepCompleted(phase)}
                  barPercent={getBarPercent(debateData.timeline[index])}
                  isCurrentPhase={isCurrentPhase(debateData.timeline[index])}
                  onMenuItemClick={onMenuItemClick}
                  onShowMenu={vertical && this.onShowMenu}
                  onHideMenu={vertical && this.onHideMenu}
                />
              ))}
          </div>
          {vertical && (
            <Slide in={menuItemOpen} className={'timeline-menu'} onExited={this.onTimeLineMenuExited}>
              {selectedPhase && <TimelineMenu vertical phase={selectedPhase} />}
            </Slide>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locale: state.i18n.locale,
  debate: state.debate
});

export default connect(mapStateToProps, null, null, { withRef: true })(DumbTimeline);