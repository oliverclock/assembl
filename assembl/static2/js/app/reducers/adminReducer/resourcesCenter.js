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
  UPDATE_RESOURCES,
  UPDATE_RC_PAGE_TITLE,
  UPDATE_RC_HEADER_IMAGE,
  UPDATE_RC_PAGE
} from '../../actions/actionTypes';
import { updateInLangstringEntries } from '../../utils/i18n';

const initialPage = Map({
  _hasChanged: false,
  titleEntries: List(),
  headerImage: Map({
    externalUrl: '',
    mimeType: '',
    title: ''
  })
});
type PageState = Map<string, any>;
type PageReducer = (PageState, ReduxAction<Action>) => PageState;
export const page: PageReducer = (state = initialPage, action) => {
  switch (action.type) {
  case UPDATE_RC_PAGE_TITLE:
    return state
      .update('titleEntries', updateInLangstringEntries(action.locale, fromJS(action.value)))
      .set('_hasChanged', true);
  case UPDATE_RC_HEADER_IMAGE:
    return state
      .setIn(['headerImage', 'externalUrl'], action.value)
      .setIn(['headerImage', 'mimeType'], action.value.type)
      .set('_hasChanged', true);
  case UPDATE_RC_PAGE: {
    let newState = state;
    if (action.headerImage) {
      newState = newState
        .setIn(['headerImage', 'externalUrl'], action.headerImage.externalUrl)
        .setIn(['headerImage', 'mimeType'], action.headerImage.mimeType);
    }

    if (action.titleEntries) {
      newState = newState.set('titleEntries', fromJS(action.titleEntries));
    }

    return newState.set('_hasChanged', false);
  }
  default:
    return state;
  }
};

export const resourcesHaveChanged = (state: boolean = false, action: ReduxAction<Action>) => {
  switch (action.type) {
  case CREATE_RESOURCE:
  case DELETE_RESOURCE:
  case UPDATE_RESOURCE_DOCUMENT:
  case UPDATE_RESOURCE_EMBED_CODE:
  case UPDATE_RESOURCE_IMAGE:
  case UPDATE_RESOURCE_TEXT:
  case UPDATE_RESOURCE_TITLE:
    return true;
  case UPDATE_RESOURCES:
    return false;
  default:
    return state;
  }
};

type ResourcesInOrderState = List<number>;
type ResourcesInOrderReducer = (ResourcesInOrderState, ReduxAction<Action>) => ResourcesInOrderState;
export const resourcesInOrder: ResourcesInOrderReducer = (state = List(), action) => {
  switch (action.type) {
  case CREATE_RESOURCE:
    return state.push(action.id);
  case UPDATE_RESOURCES:
    return List(action.resources.map(r => r.id));
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
//   _toDelete: boolean,
//   _isNew: boolean,
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
  _toDelete: false,
  _isNew: true,
  _hasChanged: false,
  doc: defaultResourceDoc,
  img: defaultResourceImage,
  titleEntries: List(),
  textEntries: List(),
  embedCode: ''
});
type ResourcesByIdState = Map<string, Map>;
type ResourcesByIdReducer = (ResourcesByIdState, ReduxAction<Action>) => ResourcesByIdState;
export const resourcesById: ResourcesByIdReducer = (state: ResourcesByIdState = Map(), action: ReduxAction<Action>) => {
  switch (action.type) {
  case CREATE_RESOURCE:
    return state.set(action.id, defaultResource.set('id', action.id).set('order', action.order));
  case DELETE_RESOURCE:
    return state.setIn([action.id, '_toDelete'], true);
  case UPDATE_RESOURCE_DOCUMENT:
    return state.setIn([action.id, 'doc', 'externalUrl'], action.value).setIn([action.id, '_hasChanged'], true);
  case UPDATE_RESOURCE_EMBED_CODE:
    return state.setIn([action.id, 'embedCode'], action.value).setIn([action.id, '_hasChanged'], true);
  case UPDATE_RESOURCE_IMAGE:
    return state
      .setIn([action.id, 'img', 'externalUrl'], action.value)
      .setIn([action.id, 'img', 'mimeType'], action.value.type)
      .setIn([action.id, '_hasChanged'], true);
  case UPDATE_RESOURCE_TEXT:
    return state
      .updateIn([action.id, 'textEntries'], updateInLangstringEntries(action.locale, fromJS(action.value)))
      .setIn([action.id, '_hasChanged'], true);
  case UPDATE_RESOURCE_TITLE:
    return state
      .updateIn([action.id, 'titleEntries'], updateInLangstringEntries(action.locale, action.value))
      .setIn([action.id, '_hasChanged'], true);
  case UPDATE_RESOURCES: {
    let newState = Map();
    action.resources.forEach((resource, idx) => {
      const resourceInfo = Map({
        _hasChanged: false,
        _isNew: false,
        _toDelete: false,
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

export type ResourcesCenterState = {
  page: PageState,
  resourcesHaveChanged: boolean,
  resourcesInOrder: ResourcesInOrderState,
  resourcesById: ResourcesByIdState
};

export default combineReducers({
  page: page,
  resourcesHaveChanged: resourcesHaveChanged,
  resourcesInOrder: resourcesInOrder,
  resourcesById: resourcesById
});