// @flow
import React from 'react';
import { withApollo } from 'react-apollo';
import { Translate, Localize } from 'react-redux-i18n';
import { connect } from 'react-redux';

import Menu from './menus/menu';
import { getPhaseStatus, type Phase } from '../../../utils/timeline';
import { PHASE_STATUS } from '../../../constants';
import { MENU_KINDS } from './menus';

type TimelineMenuProps = {
  phase: Phase,
  locale: string,
  vertical: boolean,
  onMenuItemClick: Function
};

export class DumbTimelineMenu extends React.Component<*, TimelineMenuProps, void> {
  componentWillMount() {
    const { phase: { title, start, end }, locale } = this.props;
    this.phaseStatus = getPhaseStatus(start, end);
    let phaseName = '';
    title.entries.forEach((entry) => {
      if (locale === entry['@language']) {
        phaseName = entry.value.toLowerCase();
      }
    });
    this.phaseName = phaseName;
  }

  phaseStatus = null;

  phaseName = null;

  renderNotStarted = (className?: string) => {
    const { phase: { start } } = this.props;
    return (
      <div className={className}>
        <Translate value="debate.notStarted" phaseName={this.phaseName} />
        <Localize value={start} dateFormat="date.format" />
      </div>
    );
  };

  render() {
    const { phase: { identifier }, onMenuItemClick, vertical } = this.props;
    const isNotStarted = this.phaseStatus === PHASE_STATUS.notStarted;
    return (
      <div className="menu-container">
        {isNotStarted ? (
          this.renderNotStarted('not-started')
        ) : (
          <Menu identifier={identifier} onMenuItemClick={onMenuItemClick} kind={vertical ? MENU_KINDS.index : MENU_KINDS.table} />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  locale: state.i18n.locale
});

// $FlowFixMe
export default connect(mapStateToProps)(withApollo(DumbTimelineMenu));