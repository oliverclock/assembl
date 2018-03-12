// @flow
import React from 'react';
import { connect } from 'react-redux';
import { I18n, Translate } from 'react-redux-i18n';
import { List, Map } from 'immutable';
import range from 'lodash/range';
import { SplitButton, MenuItem, Radio } from 'react-bootstrap';

import Helper from '../../common/helper';
import { getEntryValueForLocale } from '../../../utils/i18n';
import { createRandomId } from '../../../utils/globalFunctions';
import FormControlWithLabel from '../../common/formControlWithLabel';
import NumberGaugeForm from './numberGaugeForm';
import TextGaugeForm from './textGaugeForm';
import {
  updateGaugeVoteInstructions,
  updateGaugeVoteNbTicks,
  updateGaugeVoteIsNumber,
  createGaugeVoteChoice,
  deleteGaugeVoteChoice,
  updateGaugeMinimum,
  updateGaugeMaximum,
  updateGaugeUnit,
  updateGaugeVoteChoiceLabel
} from '../../../actions/adminActions/voteSession';

export type VoteChoice = {|
  id: string,
  title: string
|};

type GaugeFormProps = {
  id: string,
  index?: number,
  // editLocale: string,
  instructions: string,
  nbTicks: number,
  minimum: number,
  maximum: number,
  unit: string,
  isNumberGauge: boolean,
  choices: List<VoteChoice>,
  handleInstructionsChange: Function,
  createChoice: string => void,
  deleteChoice: number => void,
  updateNbTicks: number => void,
  handleNumberGaugeCheck: Function,
  handleNumberGaugeUncheck: Function,
  handleMinChange: number => void,
  handleMaxChange: number => void,
  handleUnitChange: string => void,
  handleGaugeChoiceLabelChange: (string, string) => void
};

export const getGaugeModuleInfo = (gaugeModule: Map<string, *>, gaugeChoicesById: Map<string, *>, editLocale: string) => {
  const instructions = getEntryValueForLocale(gaugeModule.get('instructionsEntries'), editLocale);
  const choices = gaugeModule.get('choices', List());
  return {
    instructions: instructions,
    nbTicks: gaugeModule.get('isNumberGauge') ? gaugeModule.get('nbTicks') : choices.size,
    isNumberGauge: gaugeModule.get('isNumberGauge'),
    choices: gaugeModule.get('isNumberGauge')
      ? null
      : choices.map((cid) => {
        const gaugeChoice = gaugeChoicesById.get(cid);
        const title = getEntryValueForLocale(gaugeChoice.get('labelEntries'), editLocale);
        return Map({ id: cid, title: title });
      }),
    minimum: gaugeModule.get('minimum'),
    maximum: gaugeModule.get('maximum'),
    unit: gaugeModule.get('unit')
  };
};

type ChangeNbTicksParams = {
  isNumberGauge: boolean,
  nbTicks: number,
  value: number,
  createChoice: string => void,
  deleteChoice: number => void,
  updateNbTicks: number => void
};
export const changeNbTicks = ({
  createChoice,
  deleteChoice,
  isNumberGauge,
  nbTicks,
  updateNbTicks,
  value
}: ChangeNbTicksParams): void => {
  if (isNumberGauge) {
    updateNbTicks(value);
  } else if (nbTicks < value) {
    const nbChoiceToCreate = value - nbTicks;
    for (let i = 0; i < nbChoiceToCreate; i += 1) {
      const newId = createRandomId();
      createChoice(newId);
    }
  } else {
    const nbChoiceToDelete = nbTicks - value;
    for (let i = 0; i < nbChoiceToDelete; i += 1) {
      deleteChoice(nbTicks - 1 - i);
    }
  }
};

const DumbGaugeForm = ({
  id,
  instructions,
  nbTicks,
  isNumberGauge,
  choices,
  minimum,
  maximum,
  unit,
  handleInstructionsChange,
  createChoice,
  deleteChoice,
  updateNbTicks,
  handleNumberGaugeCheck,
  handleNumberGaugeUncheck,
  handleMinChange,
  handleMaxChange,
  handleUnitChange,
  handleGaugeChoiceLabelChange,
  index
}: GaugeFormProps) => (
  <div className="gauges-vote-form">
    <Translate value="administration.gauge" number={index + 1} />
    <div className="flex margin-m">
      <FormControlWithLabel
        value={instructions}
        label={I18n.t('administration.gaugeVoteInstructions')}
        required
        type="text"
        onChange={handleInstructionsChange}
      />
      <Helper
        helperUrl="/static2/img/helpers/helper6.png"
        helperText={I18n.t('administration.helpers.gaugeVoteInstructions')}
        additionalTextClasses="helper-text-only"
      />
    </div>
    <div className="flex">
      <label htmlFor={`dropdown-${id}`}>
        <Translate value="administration.nbTicks" />
      </label>
    </div>
    <SplitButton
      title={nbTicks}
      id={`dropdown-${id}`}
      required
      onSelect={eventKey =>
        changeNbTicks({
          isNumberGauge: isNumberGauge,
          nbTicks: nbTicks,
          value: eventKey,
          createChoice: createChoice,
          deleteChoice: deleteChoice,
          updateNbTicks: updateNbTicks
        })
      }
    >
      {range(10).map(value => (
        <MenuItem key={`gauge-notch-${value + 1}`} eventKey={value + 1}>
          {value + 1}
        </MenuItem>
      ))}
    </SplitButton>
    <div className="margin-m">
      <Radio onChange={handleNumberGaugeUncheck} checked={!isNumberGauge} name={`gauge-type-${id}`}>
        <Translate value="administration.textValue" />
      </Radio>
      <Radio onChange={handleNumberGaugeCheck} checked={isNumberGauge} name={`gauge-type-${id}`}>
        <Translate value="administration.numberValue" />
      </Radio>
    </div>
    {isNumberGauge && (
      <NumberGaugeForm
        id={id}
        minimum={minimum}
        maximum={maximum}
        unit={unit}
        handleMinChange={e => handleMinChange(e.target.value)}
        handleMaxChange={e => handleMaxChange(e.target.value)}
        handleUnitChange={e => handleUnitChange(e.target.value)}
      />
    )}
    {!isNumberGauge && <TextGaugeForm choices={choices} handleGaugeChoiceLabelChange={handleGaugeChoiceLabelChange} />}
    <div className="separator" />
  </div>
);

DumbGaugeForm.defaultProps = {
  index: null
};

const mapStateToProps = (state, { id, editLocale }) => {
  const { gaugeChoicesById } = state.admin.voteSession;
  const gaugeModule = state.admin.voteSession.modulesById.get(id);
  return getGaugeModuleInfo(gaugeModule, gaugeChoicesById, editLocale);
};

const mapDispatchToProps = (dispatch, { id, editLocale }) => ({
  handleInstructionsChange: e => dispatch(updateGaugeVoteInstructions(id, editLocale, e.target.value)),
  createChoice: newId => dispatch(createGaugeVoteChoice(id, newId)),
  deleteChoice: idx => dispatch(deleteGaugeVoteChoice(id, idx)),
  updateNbTicks: value => dispatch(updateGaugeVoteNbTicks(id, value)),
  handleNumberGaugeCheck: () => dispatch(updateGaugeVoteIsNumber(id, true)),
  handleNumberGaugeUncheck: () => dispatch(updateGaugeVoteIsNumber(id, false)),
  // for number gauge
  handleMinChange: value => dispatch(updateGaugeMinimum(id, value)),
  handleMaxChange: value => dispatch(updateGaugeMaximum(id, value)),
  handleUnitChange: value => dispatch(updateGaugeUnit(id, value)),
  // for text gauge
  handleGaugeChoiceLabelChange: (cid, value) => dispatch(updateGaugeVoteChoiceLabel(cid, editLocale, value))
});

export { DumbGaugeForm };

export default connect(mapStateToProps, mapDispatchToProps)(DumbGaugeForm);