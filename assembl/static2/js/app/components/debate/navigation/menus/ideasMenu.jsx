// @flow
import React from 'react';
import { connect } from 'react-redux';
import { graphql, compose } from 'react-apollo';

import AllIdeasQuery from '../../../../graphql/AllIdeasQuery.graphql';
import withLoadingIndicator from '../../../common/withLoadingIndicator';
import MenuList, { type ItemNode } from '.';

type IdeasTableProps = {
  identifier: string,
  kind: string,
  onMenuItemClick: Function,
  data: {
    loading: boolean,
    error: Object,
    ideas: Array<ItemNode>,
    rootIdea: ItemNode
  }
};

export function DumbIdeasMenu(props: IdeasTableProps) {
  const { identifier, kind, onMenuItemClick, data } = props;
  const { ideas, rootIdea } = data;
  return (
    <MenuList
      items={ideas}
      rootItem={rootIdea && rootIdea.id}
      identifier={identifier}
      onMenuItemClick={onMenuItemClick}
      kind={kind}
    />
  );
}

const IdeasTableWithData = graphql(AllIdeasQuery);

const mapStateToProps = state => ({
  lang: state.i18n.locale,
  debate: state.debate
});

export default compose(connect(mapStateToProps), IdeasTableWithData, withLoadingIndicator())(DumbIdeasMenu);