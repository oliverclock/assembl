// @flow
import React from 'react';

import BoxWithHyphen from '../../common/boxWithHyphen';
import PostActions from '../common/postActions';

export type Props = {
  debateData: DebateData,
  identifier: string,
  mySentiment: ?string,
  routerParams: RouterParams,
  sentimentCounts: SentimentCountsFragment,
  synthesisId: string,
  synthesisTitle: string,
  synthesisBody: string,
  hyphenStyle: Object
};

const ColumnSynthesis = ({
  debateData,
  identifier,
  mySentiment,
  routerParams,
  sentimentCounts,
  synthesisId,
  synthesisTitle,
  synthesisBody,
  hyphenStyle
}: Props) => (
  <div id={synthesisId} className="box synthesis background-grey posts">
    <div className="post-row">
      <div className="post-left">
        <BoxWithHyphen
          additionalContainerClassNames="column-synthesis"
          subject={synthesisTitle}
          body={synthesisBody}
          hyphenStyle={hyphenStyle}
        />
      </div>
      <div className="post-right">
        <PostActions
          debateData={debateData}
          editable={false}
          identifier={identifier}
          mySentiment={mySentiment}
          postId={synthesisId}
          routerParams={routerParams}
          sentimentCounts={sentimentCounts}
        />
      </div>
    </div>
  </div>
);

export default ColumnSynthesis;