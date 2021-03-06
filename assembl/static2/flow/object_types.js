/* @flow */
/* eslint-disable */
import { type RawContentState } from 'draft-js';

export type IdeaMessageColumns = Array<IdeaMessageColumnFragment>;

type Post = PostFragment & {
  messageClassifier: ?string,
  creationDate: string,
  parentId: number
};

type EditableDocument = DocumentFragment & {
  file?: File
};

type LangstringEntry = {
  localeCode: string,
  value: string
};

type LangstringEntries = Array<LangstringEntry>;

type RichTextLangstringEntry = {
  localeCode: string,
  value: RawContentState
};
type RichTextLangstringEntries = Array<RichTextLangstringEntry>;

type TitleEntries = {
  titleEntries: LangstringEntries
};

type RouterParams = {
  phase: string,
  slug: string,
  themeId: string
};

type Chatbot = TitleEntries & {
  link: string,
  name: string
};

type Partner = {
  link: string,
  logo: string,
  name: string
};

type Phase = Object; // TODO

type SocialMedia = {
  name: string,
  url: string
};

type Timeline = Array<Phase>;

type DebateData = Object & {
  chatbot: Chatbot,
  chatframe: any, // TODO
  dates: {
    endDate: string,
    startDate: string
  },
  headerBackgroundUrl: string,
  headerLogoUrl: ?string,
  helpUrl: string,
  identifier: string,
  introduction: TitleEntries,
  logo: string,
  objectives: TitleEntries & {
    descriptionEntries: LangstringEntries,
    images: { img1Url: string, img2Url: string }
  },
  partners: Array<Partner>,
  slug: string,
  socialMedias: Array<SocialMedia>,
  termsOfUseUrl: ?string,
  timeline: Timeline,
  topic: TitleEntries,
  translationEnabled: boolean,
  translationEnabled: boolean,
  twitter: { backgroundImageUrl: string, id: string },
  useSocialMedia: boolean,
  video: {
    descriptionEntriesTop: LangstringEntries,
    videoUrl: string
  }
};

type ErrorDef = {
  code: string,
  vars: { [string]: any }
};

type ValidationErrors = { [string]: Array<ErrorDef> };

type TextFragmentIdentifier = {
  xpathStart: string,
  xpathEnd: string,
  offsetStart: number,
  offsetEnd: number
};

type Extract = {
  textFragmentIdentifiers: Array<TextFragmentIdentifier>,
  id: string,
  creationDate: string,
  important: boolean,
  extractNature: string,
  extractAction: string,
  body: string
};
