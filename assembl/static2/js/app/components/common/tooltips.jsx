// @flow

import React from 'react';
import { Tooltip } from 'react-bootstrap';
import { Translate } from 'react-redux-i18n';

export const addSectionTooltip = (
  <Tooltip id="addSectionTooltip">
    <Translate value="administration.sections.addSection" />
  </Tooltip>
);

export const deleteSectionTooltip = (
  <Tooltip id="deleteSectionTooltip">
    <Translate value="administration.sections.deleteSection" />
  </Tooltip>
);

export const addVoteProposalTooltip = (
  <Tooltip id="addProposalTooltip">
    <Translate value="administration.voteProposals.addProposal" />
  </Tooltip>
);

export const deleteVoteProposalTooltip = (
  <Tooltip id="deleteProposalTooltip">
    <Translate value="administration.voteProposals.deleteProposal" />
  </Tooltip>
);

export const upTooltip = (
  <Tooltip id="upTooltip">
    <Translate value="administration.up" />
  </Tooltip>
);

export const downTooltip = (
  <Tooltip id="downTooltip">
    <Translate value="administration.down" />
  </Tooltip>
);

export const addThematicTooltip = (
  <Tooltip id="addThematicTooltip">
    <Translate value="administration.addThematic" />
  </Tooltip>
);

export const addQuestionTooltip = (
  <Tooltip id="addQuestionTooltip">
    <Translate value="administration.addQuestion" />
  </Tooltip>
);

export const deleteQuestionTooltip = (
  <Tooltip id="deleteQuestionTooltip">
    <Translate value="administration.deleteQuestion" />
  </Tooltip>
);

export const deleteThematicTooltip = (
  <Tooltip id="deleteThematicTooltip">
    <Translate value="administration.deleteThematic" />
  </Tooltip>
);

export const languageTooltip = (
  <Tooltip id="languageTooltip">
    <Translate value="administration.changeLanguage" />
  </Tooltip>
);

export const answerTooltip = (
  <Tooltip id="answerTooltip">
    <Translate value="debate.toAnswer" />
  </Tooltip>
);

export const sharePostTooltip = (
  <Tooltip id="sharePostTooltip">
    <Translate value="debate.sharePost" />
  </Tooltip>
);

export const shareSynthesisTooltip = (
  <Tooltip id="shareSynthesisTooltip">
    <Translate value="debate.shareSynthesis" />
  </Tooltip>
);

export const likeTooltip = (
  <Tooltip id="likeTooltip">
    <Translate value="debate.like" />
  </Tooltip>
);

export const disagreeTooltip = (
  <Tooltip id="disagreeTooltip">
    <Translate value="debate.disagree" />
  </Tooltip>
);

export const dontUnderstandTooltip = (
  <Tooltip id="dontUnderstandTooltip">
    <Translate value="debate.dontUnderstand" />
  </Tooltip>
);

export const moreInfoTooltip = (
  <Tooltip id="moreInfoTooltip">
    <Translate value="debate.moreInfo" />
  </Tooltip>
);

export const deleteMessageTooltip = (
  <Tooltip id="deleteMessageTooltip">
    <Translate value="debate.deleteMessage" />
  </Tooltip>
);

export const editMessageTooltip = (
  <Tooltip id="editMessageTooltip">
    <Translate value="debate.editMessage" />
  </Tooltip>
);

export const createResourceTooltip = (
  <Tooltip id="createResourceTooltip">
    <Translate value="administration.resourcesCenter.createResource" />
  </Tooltip>
);

export const deleteResourceTooltip = (
  <Tooltip id="deleteResourceTooltip">
    <Translate value="administration.resourcesCenter.deleteResource" />
  </Tooltip>
);

export const resetTokensTooltip = (
  <Tooltip id="resetTokensTooltip">
    <Translate value="debate.voteSession.resetTokens" />
  </Tooltip>
);

export const hiddenTooltip = <Tooltip id="hiddenTooltip" style={{ display: 'none' }} />;

export const notEnoughTokensTooltip = (
  <Tooltip id="notEnoughTokensTooltip">
    <Translate value="debate.voteSession.notEnoughTokens" />
  </Tooltip>
);

export const exclusiveTokensTooltip = (
  <Tooltip id="exclusiveTokensTooltip">
    <Translate value="debate.voteSession.exclusiveTokens" />
  </Tooltip>
);

export const nextStepTooltip = (
  <Tooltip id="nextStepTooltip">
    <Translate value="administration.nextStep" />
  </Tooltip>
);

export const previousStepTooltip = (
  <Tooltip id="previousStepTooltip">
    <Translate value="administration.previousStep" />
  </Tooltip>
);