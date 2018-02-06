// @flow
import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';
import DebateThematicsQuery from '../../../../graphql/DebateThematicsQuery.graphql';
import withLoadingIndicator from '../../../common/withLoadingIndicator';
import MenuList, { type ItemNode } from '.';

type SurveyTableProps = {
  identifier: string,
  kind: string,
  onMenuItemClick: Function,
  data: {
    loading: boolean,
    error: Object,
    thematics: Array<ItemNode>
  }
};

export function DumbSurveyMenu(props: SurveyTableProps) {
  const { identifier, kind, onMenuItemClick, data } = props;
  const { thematics } = data;
  return <MenuList items={thematics} identifier={identifier} onMenuItemClick={onMenuItemClick} kind={kind} />;
}

const SurveyTableWithData = graphql(DebateThematicsQuery);

const mapStateToProps = state => ({
  lang: state.i18n.locale,
  debate: state.debate
});

export default compose(connect(mapStateToProps), SurveyTableWithData, withLoadingIndicator())(DumbSurveyMenu);