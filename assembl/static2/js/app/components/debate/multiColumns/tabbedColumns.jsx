import React from 'react';
import { I18n } from 'react-redux-i18n';
import get from 'lodash/get';

import PostColumn from './postColumn';
import { hexToRgb } from '../../../utils/globalFunctions';
import { COLUMN_OPACITY_GAIN } from '../../../constants';
import { orderPostsByMessageClassifier } from './utils';
import { getIfPhaseCompletedByIdentifier } from '../../../utils/timeline';

export default class TabbedColumns extends React.Component {
  render() {
    const {
      messageColumns,
      posts,
      ideaId,
      width,
      lang,
      contentLocaleMapping,
      initialRowIndex,
      noRowsRenderer,
      refetchIdea,
      routerParams,
      showSynthesis,
      identifier,
      debateData
    } = this.props;
    const activeKey = this.state && 'activeKey' in this.state ? this.state.activeKey : messageColumns[0].messageClassifier;
    const columnsArray = orderPostsByMessageClassifier(messageColumns, posts);
    const isPhaseCompleted = getIfPhaseCompletedByIdentifier(debateData.timeline, identifier);
    const index = messageColumns.indexOf(messageColumns.find(messageColumn => messageColumn.messageClassifier === activeKey));
    const col = messageColumns[index];
    const synthesisProps = showSynthesis && {
      classifier: activeKey,
      debateData: debateData,
      identifier: identifier,
      mySentiment: get(col, 'columnSynthesis.mySentiment', null),
      routerParams: routerParams,
      sentimentCounts: get(col, 'columnSynthesis.sentimentCounts', 0),
      synthesisId: get(col, 'columnSynthesis.id'),
      synthesisTitle: get(col, 'columnSynthesis.subject', I18n.t('multiColumns.synthesis.title', { colName: col.name })),
      synthesisBody: get(col, 'columnSynthesis.body') || I18n.t('multiColumns.synthesis.noSynthesisYet'),
      // keep the || here, if body is empty string, we want noSynthesisYet message
      hyphenStyle: { borderTopColor: col.color }
    };
    const style = { width: `${100 / messageColumns.length}%` };
    const inactiveTabColor = 'lightgrey';
    return (
      <div className="tab-selector">
        <div className="tab-selector-buttons">
          {messageColumns.map((messageColumn) => {
            const classifier = messageColumn.messageClassifier;
            const isActive = classifier === activeKey;
            return (
              <div key={classifier} className={`${isActive ? 'active ' : ''}button-container`} style={style}>
                <button
                  style={{
                    backgroundColor: isActive ? `rgba(${hexToRgb(messageColumn.color)},${COLUMN_OPACITY_GAIN})` : inactiveTabColor
                  }}
                  onClick={(event) => {
                    event.preventDefault();
                    return this.setState({ activeKey: classifier });
                  }}
                  disabled={isActive}
                >
                  {messageColumn.name}
                </button>
              </div>
            );
          })}
        </div>
        <div className="tab-content">
          <PostColumn
            synthesisProps={synthesisProps}
            width={width}
            contentLocaleMapping={contentLocaleMapping}
            lang={lang}
            color={col.color}
            classifier={activeKey}
            title={col.title}
            data={columnsArray[activeKey]}
            initialRowIndex={initialRowIndex}
            noRowsRenderer={noRowsRenderer}
            ideaId={ideaId}
            refetchIdea={refetchIdea}
            identifier={identifier}
            withColumnHeader={!isPhaseCompleted}
          />
        </div>
      </div>
    );
  }
}