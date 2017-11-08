// @flow
import { combineReducers } from 'redux';
import type ReduxAction from 'redux';
import { fromJS, List, Map } from 'immutable';

import {
  type Action,
  CREATE_RESOURCE,
  DELETE_RESOURCE,
  UPDATE_RESOURCE_DOCUMENT,
  UPDATE_RESOURCE_EMBED_CODE,
  UPDATE_RESOURCE_IMAGE,
  UPDATE_RESOURCE_TEXT,
  UPDATE_RESOURCE_TITLE,
  UPDATE_RESOURCES
} from '../../actions/actionTypes';
import { updateInLangstringEntries } from '../../utils/i18n';

export const resourcesInOrder = (state: List<number> = List(), action: ReduxAction<Action>) => {
  switch (action.type) {
  case CREATE_RESOURCE:
    return state.push(action.id);
  case UPDATE_RESOURCES:
    return List(
      action.resources.map((r) => {
        return r.id;
      })
    );
  default:
    return state;
  }
};

// TODO: declare Map shape for ResourceItem (it seems not possible for now:
// https://stackoverflow.com/questions/37033339/how-to-describe-immutable-js-map-shape-with-flow)
// maybe we should use Record instead of Map for this kind of stuff
//
// type LangString = {
//   localeCode: string,
//   value: string
// };
//
// type ResourceItem = {
//   toDelete: boolean,
//   isNew: boolean,
//   doc: { externalUrl: string },
//   id: string,
//   img: { externalUrl: string, mimeType: string },
//   titleEntries: List<LangString>,
//   textEntries: List<LangString>,
//   embedCode: string
// };
const defaultResourceDoc = Map({
  externalUrl: ''
});
const defaultResourceImage = Map({
  externalUrl: '',
  mimeType: ''
});
const defaultResource = Map({
  toDelete: false,
  isNew: true,
  doc: defaultResourceDoc,
  img: defaultResourceImage,
  titleEntries: List(),
  textEntries: List(),
  embedCode: ''
});
export const resourcesById = (state: Map<string, Map> = Map(), action: ReduxAction<Action>) => {
  switch (action.type) {
  case CREATE_RESOURCE:
    return state.set(action.id, defaultResource.set('id', action.id).set('order', action.order));
  case DELETE_RESOURCE:
    return state.setIn([action.id, 'toDelete'], true);
  case UPDATE_RESOURCE_DOCUMENT:
    return state.setIn([action.id, 'doc', 'externalUrl'], action.value);
  case UPDATE_RESOURCE_EMBED_CODE:
    return state.setIn([action.id, 'embedCode'], action.value);
  case UPDATE_RESOURCE_IMAGE:
    return state
      .setIn([action.id, 'img', 'externalUrl'], action.value)
      .setIn([action.id, 'img', 'mimeType'], action.value.type);
  case UPDATE_RESOURCE_TEXT:
    return state.updateIn([action.id, 'textEntries'], updateInLangstringEntries(action.locale, fromJS(action.value)));
  case UPDATE_RESOURCE_TITLE:
    return state.updateIn([action.id, 'titleEntries'], updateInLangstringEntries(action.locale, action.value));
  case UPDATE_RESOURCES: {
    let newState = Map();
    action.resources.forEach((resource, idx) => {
      const resourceInfo = Map({
        toDelete: false,
        isNew: false,
        order: idx + 1,
        doc: resource.doc ? fromJS(resource.doc) : defaultResourceDoc,
        id: resource.id,
        img: resource.image ? fromJS(resource.image) : defaultResourceImage,
        titleEntries: fromJS(resource.titleEntries),
        textEntries: fromJS(resource.textEntries),
        embedCode: resource.embedCode
      });

      newState = newState.set(resource.id, resourceInfo);
    });

    return newState;
  }
  default:
    return state;
  }
};

export default combineReducers({
  resourcesInOrder: resourcesInOrder,
  resourcesById: resourcesById
});