// @flow
import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { isCurrentPhase, getBarPercent, isStepCompleted } from '../../../utils/timeline';
import TimelineSegment, { type DebateType } from './timelineSegment';

export type PhaseData = {
  id: string,
  title: string
};

type TimelineProps = {
  debate: DebateType,
  showNavigation: boolean,
  identifier: string,
  vertical: boolean,
  onMenuItemClick: Function,
  onMenuShown: Function,
  onMenuClosed: Function
};

type TimelineState = {
  selectedPhase: ?string
};

export class DumbTimeline extends React.Component<*, TimelineProps, TimelineState> {
  state = {
    selectedPhase: null
  };

  segments = {};

  onShowMenu = (phase: PhaseData) => {
    const { onMenuShown } = this.props;
    this.setState({ selectedPhase: phase.id }, () => {
      if (onMenuShown) onMenuShown(phase);
    });
  };

  onHideMenu = () => {
    const { onMenuClosed } = this.props;
    this.setState({ selectedPhase: null }, () => {
      if (onMenuClosed) onMenuClosed();
    });
  };

  closeMenu = () => {
    const { selectedPhase } = this.state;
    const segment = selectedPhase && this.segments[selectedPhase];
    if (segment) {
      segment
        // connec wrapper
        .getWrappedInstance()
        // apollo wrapper
        .getWrappedInstance()
        .close();
    }
    this.setState({ selectedPhase: null });
  };

  render() {
    const { debateData } = this.props.debate;
    const { showNavigation, identifier, onMenuItemClick, vertical } = this.props;
    const { selectedPhase } = this.state;
    return (
      <div
        className={classNames(
          'timeline-container',
          { vertical: vertical },
          { 'timeline-menu-container': vertical && selectedPhase }
        )}
      >
        {debateData.timeline &&
          debateData.timeline.map((phase, index) => {
            if (!vertical || !selectedPhase || selectedPhase === phase.identifier) {
              return (
                <TimelineSegment
                  ref={(segment) => {
                    this.segments[phase.identifier] = segment;
                  }}
                  vertical={vertical}
                  title={phase.title}
                  index={index}
                  key={index}
                  barPercent={getBarPercent(debateData.timeline[index])}
                  isCurrentPhase={isCurrentPhase(debateData.timeline[index])}
                  showNavigation={showNavigation}
                  identifier={identifier}
                  phaseIdentifier={phase.identifier}
                  startDate={phase.start}
                  endDate={phase.end}
                  isStepCompleted={isStepCompleted(phase)}
                  onMenuItemClick={onMenuItemClick}
                  onShowMenu={vertical && this.onShowMenu}
                  onHideMenu={vertical && this.onHideMenu}
                />
              );
            }
            return null;
          })}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  debate: state.debate
});

export default connect(mapStateToProps, null, null, { withRef: true })(DumbTimeline);