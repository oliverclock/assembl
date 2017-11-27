/* @flow */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type PublicationStates =
  | 'MODERATED_TEXT_ON_DEMAND'
  | 'SUBMITTED_AWAITING_MODERATION'
  | 'PUBLISHED'
  | 'DELETED_BY_ADMIN'
  | 'DELETED_BY_USER'
  | 'DRAFT'
  | 'WIDGET_SCOPED'
  | 'SUBMITTED_IN_EDIT_GRACE_PERIOD'
  | 'MODERATED_TEXT_NEVER_AVAILABLE';

export type SentimentTypes = 'LIKE' | 'DISAGREE' | 'DONT_UNDERSTAND' | 'MORE_INFO';

export type LangStringEntryInput = {|
  value?: ?string,
  localeCode: string
|};

export type QuestionInput = {|
  id?: ?string,
  titleEntries: Array<?LangStringEntryInput>
|};

export type VideoInput = {|
  titleEntries?: ?Array<?LangStringEntryInput>,
  descriptionEntriesTop?: ?Array<?LangStringEntryInput>,
  descriptionEntriesBottom?: ?Array<?LangStringEntryInput>,
  descriptionEntriesSide?: ?Array<?LangStringEntryInput>,
  htmlCode?: ?string
|};

export type AllIdeasQueryQueryVariables = {|
  lang: string,
  identifier: string
|};

export type AllIdeasQueryQuery = {|
  ideas: ?Array<?{|
    // The ID of the object.
    id: string,
    title: ?string,
    description: ?string,
    numPosts: ?number,
    numContributors: ?number,
    numChildren: ?number,
    img: ?{|
      externalUrl: ?string
    |},
    order: ?number,
    parentId: ?string
  |}>,
  rootIdea: ?(
    | {
        // The ID of the object.
        id: string
      }
    | {})
|};

export type AllLanguagePreferencesQueryVariables = {|
  inLocale: string
|};

export type AllLanguagePreferencesQuery = {|
  defaultPreferences: ?{|
    languages: ?Array<?{|
      locale: ?string,
      name: ?string
    |}>
  |}
|};

export type DebateThematicsQueryQueryVariables = {|
  lang: string,
  identifier: string
|};

export type DebateThematicsQueryQuery = {|
  thematics: ?Array<?{|
    // The ID of the object.
    id: string,
    // An identifier correspond to a specific phase.
    identifier: ?string,
    title: ?string,
    description: ?string,
    numPosts: ?number,
    numContributors: ?number,
    img: ?{|
      externalUrl: ?string
    |}
  |}>
|};

export type DiscussionPreferencesQueryVariables = {|
  inLocale: string
|};

export type DiscussionPreferencesQuery = {|
  discussionPreferences: ?{|
    languages: ?Array<?{|
      locale: ?string,
      name: ?string,
      nativeName: ?string
    |}>
  |}
|};

export type IdeaQueryVariables = {|
  lang: string,
  id: string
|};

export type IdeaQuery = {|
  // The ID of the object
  idea: ?(
    | {
        // The ID of the object.
        id: string,
        title: ?string,
        synthesisTitle: ?string,
        description: ?string,
        img: ?{|
          externalUrl: ?string
        |},
        announcement: ?{|
          title: ?string,
          body: ?string
        |}
      }
    | {}
    | {}
    | {}
    | {}
    | {}
    | {}
    | {})
|};

export type IdeaWithPostsQueryVariables = {|
  id: string,
  lang?: ?string
|};

export type IdeaWithPostsQuery = {|
  // The ID of the object
  idea: ?(
    | {
        // The ID of the object.
        id: string,
        numPosts: ?number,
        numContributors: ?number,
        messageColumns: ?Array<?{|
          // A CSS color that will be used to theme the column.
          color: ?string,
          header: ?string,
          index: ?number,
          // Identifier for the column, will match :py:attr:`assembl.models.generic.Content.message_classifier`
          messageClassifier: string,
          name: ?string,
          numPosts: ?number,
          title: ?string
        |}>,
        posts: ?{|
          edges: Array<?{|
            // The item at the end of the edge
            node: ?{|
              // The ID of the object.
              id: string,
              parentId: ?string,
              creationDate: ?any,
              publicationState: ?PublicationStates,
              originalLocale: ?string,
              // Classifier for column views
              messageClassifier: ?string,
              sentimentCounts: ?{|
                like: ?number,
                disagree: ?number,
                dontUnderstand: ?number,
                moreInfo: ?number
              |}
            |}
          |}>
        |}
      }
    | {}
    | {}
    | {}
    | {}
    | {}
    | {}
    | {})
|};

export type LocalesQueryQueryVariables = {|
  lang: string
|};

export type LocalesQueryQuery = {|
  locales: ?Array<?{|
    localeCode: string,
    label: string
  |}>
|};

export type PostQueryVariables = {|
  contentLocale: string,
  id: string
|};

export type PostQuery = {|
  // The ID of the object
  post: ?(
    | {}
    | {
        // The ID of the object.
        id: string,
        subjectEntries: ?Array<?{|
          value: ?string,
          localeCode: string
        |}>,
        bodyEntries: ?Array<?{|
          value: ?string,
          localeCode: string
        |}>,
        sentimentCounts: ?{|
          like: ?number,
          disagree: ?number,
          dontUnderstand: ?number,
          moreInfo: ?number
        |},
        mySentiment: ?SentimentTypes,
        indirectIdeaContentLinks: ?Array<?{|
          idea: ?{|
            // The ID of the object.
            id: string,
            title: ?string
          |}
        |}>,
        creator: ?{|
          // The ID of the object.
          id: string,
          userId: number,
          name: ?string
        |},
        modificationDate: ?any,
        bodyMimeType: string,
        publicationState: ?PublicationStates,
        extracts: ?Array<?{|
          // The ID of the object.
          id: string,
          body: string
        |}>,
        attachments: ?Array<?{|
          id: string,
          document: ?{|
            id: string,
            title: ?string,
            externalUrl: ?string,
            mimeType: ?string
          |}
        |}>
      }
    | {}
    | {}
    | {}
    | {}
    | {}
    | {})
|};

export type RootIdeaStatsQuery = {|
  rootIdea: ?(
    | {
        // The ID of the object.
        id: string,
        numPosts: ?number
      }
    | {
        // The ID of the object.
        id: string,
        numPosts: ?number
      }),
  totalSentiments: ?number,
  numParticipants: ?number
|};

export type RootIdeasQueryQueryVariables = {|
  lang: string
|};

export type RootIdeasQueryQuery = {|
  rootIdea: ?(
    | {
        children: ?Array<?{|
          // The ID of the object.
          id: string,
          title: ?string,
          description: ?string,
          numPosts: ?number,
          numContributors: ?number,
          img: ?{|
            externalUrl: ?string
          |}
        |}>
      }
    | {})
|};

export type ThematicQueryQueryVariables = {|
  lang: string,
  id: string
|};

export type ThematicQueryQuery = {|
  // The ID of the object
  thematic: ?(
    | {}
    | {}
    | {}
    | {}
    | {}
    | {}
    | {
        title: ?string,
        img: ?{|
          externalUrl: ?string,
          mimeType: ?string
        |},
        // The ID of the object.
        id: string,
        video: ?{|
          title: ?string,
          descriptionTop: ?string,
          descriptionBottom: ?string,
          descriptionSide: ?string,
          htmlCode: ?string
        |},
        questions: ?Array<?{|
          title: ?string,
          // The ID of the object.
          id: string,
          posts: ?{|
            edges: Array<?{|
              // The item at the end of the edge
              node: ?{|
                // The ID of the object.
                id: string,
                originalLocale: ?string
              |}
            |}>
          |}
        |}>
      }
    | {})
|};

export type ThematicsQueryQueryVariables = {|
  identifier: string
|};

export type ThematicsQueryQuery = {|
  thematics: ?Array<?{|
    // The ID of the object.
    id: string,
    titleEntries: ?Array<?{|
      localeCode: string,
      value: ?string
    |}>,
    img: ?{|
      externalUrl: ?string,
      mimeType: ?string
    |},
    video: ?{|
      titleEntries: ?Array<?{|
        localeCode: string,
        value: ?string
      |}>,
      descriptionEntriesTop: ?Array<?{|
        localeCode: string,
        value: ?string
      |}>,
      descriptionEntriesBottom: ?Array<?{|
        localeCode: string,
        value: ?string
      |}>,
      descriptionEntriesSide: ?Array<?{|
        localeCode: string,
        value: ?string
      |}>,
      htmlCode: ?string
    |},
    questions: ?Array<?{|
      // The ID of the object.
      id: string,
      titleEntries: ?Array<?{|
        localeCode: string,
        value: ?string
      |}>
    |}>
  |}>
|};

export type addSentimentMutationVariables = {|
  type: SentimentTypes,
  postId: string
|};

export type addSentimentMutation = {|
  addSentiment: ?{|
    post: ?{|
      // The ID of the object.
      id: string,
      sentimentCounts: ?{|
        like: ?number,
        disagree: ?number,
        dontUnderstand: ?number,
        moreInfo: ?number
      |},
      mySentiment: ?SentimentTypes
    |}
  |}
|};

export type createPostMutationVariables = {|
  contentLocale: string,
  ideaId: string,
  subject?: ?string,
  body: string,
  messageClassifier?: ?string,
  parentId?: ?string,
  attachments?: ?Array<?string>
|};

export type createPostMutation = {|
  createPost: ?{|
    post: ?{|
      // The ID of the object.
      id: string,
      subjectEntries: ?Array<?{|
        value: ?string,
        localeCode: string
      |}>,
      bodyEntries: ?Array<?{|
        value: ?string,
        localeCode: string
      |}>,
      sentimentCounts: ?{|
        like: ?number,
        disagree: ?number,
        dontUnderstand: ?number,
        moreInfo: ?number
      |},
      mySentiment: ?SentimentTypes,
      indirectIdeaContentLinks: ?Array<?{|
        idea: ?{|
          // The ID of the object.
          id: string,
          title: ?string
        |}
      |}>,
      creator: ?{|
        // The ID of the object.
        id: string,
        userId: number,
        name: ?string
      |},
      modificationDate: ?any,
      bodyMimeType: string,
      publicationState: ?PublicationStates,
      extracts: ?Array<?{|
        // The ID of the object.
        id: string,
        body: string
      |}>,
      attachments: ?Array<?{|
        id: string,
        document: ?{|
          id: string,
          title: ?string,
          externalUrl: ?string,
          mimeType: ?string
        |}
      |}>,
      parentId: ?string,
      creationDate: ?any
    |}
  |}
|};

export type createThematicMutationVariables = {|
  identifier: string,
  image?: ?string,
  titleEntries: Array<?LangStringEntryInput>,
  questions?: ?Array<?QuestionInput>,
  video?: ?VideoInput
|};

export type createThematicMutation = {|
  createThematic: ?{|
    thematic: ?{|
      title: ?string,
      img: ?{|
        externalUrl: ?string,
        mimeType: ?string
      |},
      video: ?{|
        title: ?string,
        descriptionTop: ?string,
        descriptionBottom: ?string,
        descriptionSide: ?string,
        htmlCode: ?string
      |},
      questions: ?Array<?{|
        title: ?string
      |}>
    |}
  |}
|};

export type deletePostMutationVariables = {|
  postId: string
|};

export type deletePostMutation = {|
  deletePost: ?{|
    post: ?{|
      // The ID of the object.
      id: string,
      publicationState: ?PublicationStates
    |}
  |}
|};

export type deleteSentimentMutationVariables = {|
  postId: string
|};

export type deleteSentimentMutation = {|
  deleteSentiment: ?{|
    post: ?{|
      // The ID of the object.
      id: string,
      sentimentCounts: ?{|
        like: ?number,
        disagree: ?number,
        dontUnderstand: ?number,
        moreInfo: ?number
      |},
      mySentiment: ?SentimentTypes
    |}
  |}
|};

export type deleteThematicMutationVariables = {|
  thematicId: string
|};

export type deleteThematicMutation = {|
  deleteThematic: ?{|
    success: ?boolean
  |}
|};

export type updateDiscussionPreferenceMutationVariables = {|
  languages: Array<?string>
|};

export type updateDiscussionPreferenceMutation = {|
  updateDiscussionPreferences: ?{|
    preferences: ?{|
      languages: ?Array<?{|
        locale: ?string
      |}>
    |}
  |}
|};

export type updatePostMutationVariables = {|
  contentLocale: string,
  postId: string,
  subject?: ?string,
  body: string,
  attachments?: ?Array<?string>
|};

export type updatePostMutation = {|
  updatePost: ?{|
    post: ?{|
      // The ID of the object.
      id: string,
      subjectEntries: ?Array<?{|
        value: ?string,
        localeCode: string
      |}>,
      bodyEntries: ?Array<?{|
        value: ?string,
        localeCode: string
      |}>,
      sentimentCounts: ?{|
        like: ?number,
        disagree: ?number,
        dontUnderstand: ?number,
        moreInfo: ?number
      |},
      mySentiment: ?SentimentTypes,
      indirectIdeaContentLinks: ?Array<?{|
        idea: ?{|
          // The ID of the object.
          id: string,
          title: ?string
        |}
      |}>,
      creator: ?{|
        // The ID of the object.
        id: string,
        userId: number,
        name: ?string
      |},
      modificationDate: ?any,
      bodyMimeType: string,
      publicationState: ?PublicationStates,
      extracts: ?Array<?{|
        // The ID of the object.
        id: string,
        body: string
      |}>,
      attachments: ?Array<?{|
        id: string,
        document: ?{|
          id: string,
          title: ?string,
          externalUrl: ?string,
          mimeType: ?string
        |}
      |}>
    |}
  |}
|};

export type updateThematicMutationVariables = {|
  id: string,
  identifier: string,
  image?: ?string,
  titleEntries: Array<?LangStringEntryInput>,
  questions?: ?Array<?QuestionInput>,
  video?: ?VideoInput
|};

export type updateThematicMutation = {|
  updateThematic: ?{|
    thematic: ?{|
      title: ?string,
      img: ?{|
        externalUrl: ?string
      |},
      video: ?{|
        title: ?string,
        descriptionTop: ?string,
        descriptionBottom: ?string,
        descriptionSide: ?string,
        htmlCode: ?string
      |},
      questions: ?Array<?{|
        // The ID of the object.
        id: string,
        title: ?string
      |}>
    |}
  |}
|};

export type uploadDocumentMutationVariables = {|
  file: string
|};

export type uploadDocumentMutation = {|
  uploadDocument: ?{|
    document: ?{|
      id: string,
      externalUrl: ?string,
      mimeType: ?string,
      title: ?string
    |}
  |}
|};

export type AgentProfileInfoFragment = {|
  // The ID of the object.
  id: string,
  userId: number,
  name: ?string
|};

export type IdeaMessageColumnFragment = {|
  // A CSS color that will be used to theme the column.
  color: ?string,
  header: ?string,
  index: ?number,
  // Identifier for the column, will match :py:attr:`assembl.models.generic.Content.message_classifier`
  messageClassifier: string,
  name: ?string,
  numPosts: ?number,
  title: ?string
|};

export type PostFragment = {|
  // The ID of the object.
  id: string,
  subjectEntries: ?Array<?{|
    value: ?string,
    localeCode: string
  |}>,
  bodyEntries: ?Array<?{|
    value: ?string,
    localeCode: string
  |}>,
  sentimentCounts: ?{|
    like: ?number,
    disagree: ?number,
    dontUnderstand: ?number,
    moreInfo: ?number
  |},
  mySentiment: ?SentimentTypes,
  indirectIdeaContentLinks: ?Array<?{|
    idea: ?{|
      // The ID of the object.
      id: string,
      title: ?string
    |}
  |}>,
  creator: ?{|
    // The ID of the object.
    id: string,
    userId: number,
    name: ?string
  |},
  modificationDate: ?any,
  bodyMimeType: string,
  publicationState: ?PublicationStates,
  extracts: ?Array<?{|
    // The ID of the object.
    id: string,
    body: string
  |}>,
  attachments: ?Array<?{|
    id: string,
    document: ?{|
      id: string,
      title: ?string,
      externalUrl: ?string,
      mimeType: ?string
    |}
  |}>
|};