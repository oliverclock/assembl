# -*- coding: utf-8 -*-
import json

from assembl.graphql.schema import Schema as schema
from assembl.lib.utils import snake_to_camel
from assembl.graphql.langstring import resolve_langstring
from assembl import models
import os
from io import BytesIO
from graphql_relay.node.node import to_global_id


def assert_langstring_is_equal(langstring_name, graphql_model, sqla_model):
    sqla_value = sqla_en_value(getattr(sqla_model, langstring_name))
    graphql_value = graphql_en_value(graphql_model[snake_to_camel(langstring_name) + 'Entries'])
    assert sqla_value == graphql_value


def assert_langstrings_are_equal(langstrings_names, graphql_model, sqla_model):
    for langstring_name in langstrings_names:
        assert_langstring_is_equal(langstring_name, graphql_model, sqla_model)


def graphql_en_value(entries):
    for entry in entries:
        if entry['localeCode'] == "en":
            return entry['value']
    raise Exception("No 'en' value in entries {}".format(entries))


def sqla_en_value(entries):
    return resolve_langstring(entries, "en")


def en_entry(value):
    return [{"localeCode": "en", "value": value}]


def assert_graphql_unauthorized(response):
    assert "wrong credentials" in response.errors[0].message


def assert_vote_session_not_created(discussion_phase_id, graphql_request, graphql_registry):
    response = schema.execute(
        graphql_registry['VoteSession'],
        context_value=graphql_request,
        variable_values={"discussionPhaseId": discussion_phase_id, "lang": "en"}
    )
    assert response.errors is None
    assert response.data['voteSession'] is None


def mutate_and_assert_unauthorized(graphql_request, discussion_phase_id, graphql_registry):
    new_title = u"updated vote session title"
    response = schema.execute(
        graphql_registry['updateVoteSession'],
        context_value=graphql_request,
        variable_values={
            "discussionPhaseId": discussion_phase_id,
            "titleEntries": en_entry(new_title)
        }
    )
    assert_graphql_unauthorized(response)


def mutate_and_assert(graphql_request, discussion_phase_id, test_app, graphql_registry):
    new_title = u"updated vote session title"
    new_sub_title = u"updated vote session sub title"
    new_instructions_section_title = u"updated vote session instructions title"
    new_instructions_section_content = u"updated vote session instructions content"
    new_propositions_section_title = u"updated vote session propositions section title"

    class FieldStorage(object):
        file = BytesIO(os.urandom(16))

        def __init__(self, filename, type):
            self.filename = filename
            self.type = type

    new_image_name = u'new-image.png'
    new_image_mime_type = 'image/png'
    new_image = FieldStorage(new_image_name, new_image_mime_type)
    image_var_name = u'variables.img'
    graphql_request.POST[image_var_name] = new_image

    response = schema.execute(
        graphql_registry['updateVoteSession'],
        context_value=graphql_request,
        variable_values={
            "discussionPhaseId": discussion_phase_id,
            "titleEntries": en_entry(new_title),
            "subTitleEntries": en_entry(new_sub_title),
            "instructionsSectionTitleEntries": en_entry(new_instructions_section_title),
            "instructionsSectionContentEntries": en_entry(new_instructions_section_content),
            "propositionsSectionTitleEntries": en_entry(new_propositions_section_title),
            "headerImage": image_var_name
        }
    )

    assert response.errors is None
    graphql_vote_session = response.data['updateVoteSession']['voteSession']

    assert graphql_en_value(graphql_vote_session['titleEntries']) == new_title
    assert graphql_en_value(graphql_vote_session['subTitleEntries']) == new_sub_title
    assert graphql_en_value(graphql_vote_session['instructionsSectionTitleEntries']) == new_instructions_section_title
    assert graphql_en_value(graphql_vote_session['instructionsSectionContentEntries']) == new_instructions_section_content
    assert graphql_en_value(graphql_vote_session['propositionsSectionTitleEntries']) == new_propositions_section_title

    graphql_image = graphql_vote_session['headerImage']
    assert graphql_image['title'] == new_image_name
    assert graphql_image['mimeType'] == new_image_mime_type
    new_image_data = new_image.file.getvalue()
    graphql_image_data = test_app.get(graphql_image['externalUrl']).body
    assert graphql_image_data == new_image_data


def vote_session_from_phase(discussion_phase_id):
    discussion_phase = models.DiscussionPhase.get(discussion_phase_id)
    return discussion_phase.vote_session


def image_from_vote_session(vote_session):
    ATTACHMENT_PURPOSE_IMAGE = models.AttachmentPurpose.IMAGE.value
    for attachment in vote_session.attachments:
        if attachment.attachmentPurpose == ATTACHMENT_PURPOSE_IMAGE:
            return attachment.document


def delete_vote_session(vote_session):
    db = vote_session.db
    image = image_from_vote_session(vote_session)
    db.delete(vote_session)
    db.delete(image)
    db.flush()


def test_graphql_update_vote_session(graphql_request, vote_session, test_app, graphql_registry):
    mutate_and_assert(graphql_request, vote_session.discussion_phase_id, test_app, graphql_registry)


def test_graphql_delete_vote_session_cascade(graphql_request, vote_session, test_app, graphql_registry):
    db = vote_session.db;
    image_id = image_from_vote_session(vote_session).id
    attachment_id = vote_session.attachments[0].id
    db.delete(vote_session)
    db.flush()
    attachment = models.VoteSessionAttachment.get(attachment_id)
    assert attachment is None
    # TODO: fix the cascade behaviour to delete the actual document maybe?
    # image = models.Document.get(image_id)
    # assert image is None


def test_graphql_update_vote_session_unauthenticated(graphql_unauthenticated_request, vote_session, graphql_registry):
    mutate_and_assert_unauthorized(graphql_unauthenticated_request, vote_session.discussion_phase_id, graphql_registry)


def test_graphql_create_vote_session(graphql_request, timeline_vote_session, test_app, graphql_registry):
    assert_vote_session_not_created(timeline_vote_session.id, graphql_request, graphql_registry)
    mutate_and_assert(graphql_request, timeline_vote_session.id, test_app, graphql_registry)
    vote_session = vote_session_from_phase(timeline_vote_session.id)
    delete_vote_session(vote_session)


def test_graphql_create_vote_session_unauthenticated(graphql_participant1_request, timeline_vote_session, test_app, graphql_registry):
    assert_vote_session_not_created(timeline_vote_session.id, graphql_participant1_request, graphql_registry)
    mutate_and_assert_unauthorized(graphql_participant1_request, timeline_vote_session.id, graphql_registry)


def test_graphql_get_vote_session(graphql_participant1_request, vote_session, graphql_registry):
    response = schema.execute(
        graphql_registry['VoteSession'],
        context_value=graphql_participant1_request,
        variable_values={
            "discussionPhaseId": vote_session.discussion_phase_id,
            "lang": "en"
        }
    )

    assert response.errors is None
    graphql_vote_session = response.data['voteSession']

    assert_langstrings_are_equal(
        [
            "title",
            "sub_title",
            "instructions_section_title",
            "instructions_section_content",
            "propositions_section_title"
        ],
        graphql_vote_session,
        vote_session)

    graphql_image = graphql_vote_session['headerImage']
    source_image = image_from_vote_session(vote_session)
    assert graphql_image['title'] == source_image.title
    assert graphql_image['mimeType'] == source_image.mime_type
    assert graphql_image['externalUrl'] == source_image.external_url


def test_graphql_get_vote_session_unauthenticated(graphql_unauthenticated_request, vote_session, graphql_registry):
    response = schema.execute(
        graphql_registry['VoteSession'],
        context_value=graphql_unauthenticated_request,
        variable_values={
            "discussionPhaseId": vote_session.discussion_phase_id,
            "lang": "en"
        }
    )
    assert_graphql_unauthorized(response)


def test_mutation_create_token_vote_specification(graphql_request, vote_session, graphql_registry):
    mutation = graphql_registry['createTokenVoteSpecification']
    vote_session_id = to_global_id("VoteSession", vote_session.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "voteSessionId": vote_session_id,
        "titleEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues", "localeCode": "en"}
        ],
        "instructionsEntries":
        [
            {"value": u"Comprendre les dynamiques et les enjeux", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues", "localeCode": "en"}
        ],
        "exclusiveCategories": True,
        "tokenCategories": [
            {"titleEntries": [
                {"value": u"Comprendre les dynamiques et les enjeux", "localeCode": "fr"},
                {"value": u"Understanding the dynamics and issues", "localeCode": "en"}
             ],
             "typename": "positive",
             "totalNumber": 10,
             "color": 'red'
            }
        ]
    })
    assert res.errors is None
    token_vote_spec = vote_session.vote_specifications[0]
    token_vote_spec_id = to_global_id("TokenVoteSpecification", token_vote_spec.id)
    token_category = token_vote_spec.token_categories[0]
    token_category_id = to_global_id("TokenCategorySpecification", token_category.id)
    assert json.loads(json.dumps(res.data)) == {
u'createTokenVoteSpecification': {u'voteSpecification': {u'exclusiveCategories': True,
                                                              u'id': token_vote_spec_id,
                                                              u'instructionsEntries': [{u'localeCode': u'en',
                                                                                        u'value': u'Understanding the dynamics and issues'},
                                                                                       {u'localeCode': u'fr',
                                                                                        u'value': u'Comprendre les dynamiques et les enjeux'}],
                                                              u'titleEntries': [{u'localeCode': u'en',
                                                                                 u'value': u'Understanding the dynamics and issues'},
                                                                                {u'localeCode': u'fr',
                                                                                 u'value': u'Comprendre les dynamiques et les enjeux'}],
                                                              u'tokenCategories': [{u'color': u'red',
                                                                                    u'id': token_category_id,
                                                                                    u'titleEntries': [{u'localeCode': u'en',
                                                                                                       u'value': u'Understanding the dynamics and issues'},
                                                                                                      {u'localeCode': u'fr',
                                                                                                       u'value': u'Comprendre les dynamiques et les enjeux'}],
                                                                                    u'totalNumber': 10,
                                                                                    u'typename': u'positive'}],
                                                              u'voteSessionId': vote_session_id}}}
    # remove created vote specification
    vote_session.vote_specifications.remove(token_vote_spec)
    vote_session.db.flush()


def test_mutation_delete_token_vote_specification(graphql_request, token_vote_specification, graphql_registry):
    mutation = graphql_registry['deleteVoteSpecification']
    token_vote_spec_id = to_global_id("TokenVoteSpecification", token_vote_specification.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "id": token_vote_spec_id
    })
    assert res.errors is None
    assert True == res.data['deleteVoteSpecification']['success']


def test_mutation_update_token_vote_specification(graphql_request, vote_session, token_vote_specification, graphql_registry):
    mutation = graphql_registry['updateTokenVoteSpecification']
    vote_session_id = to_global_id("VoteSession", vote_session.id)
    token_vote_spec_id = to_global_id("TokenVoteSpecification", token_vote_specification.id)
    token_category = token_vote_specification.token_categories[0]
    token_category_id = to_global_id("TokenCategorySpecification", token_category.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "id": token_vote_spec_id,
        "titleEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux (updated)", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues (updated)", "localeCode": "en"}
        ],
        "instructionsEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux (updated)", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues (updated)", "localeCode": "en"}
        ],
        "exclusiveCategories": True,
        "tokenCategories": [
            {
             "id": token_category_id,
             "titleEntries": [
                {"value": u"Comprendre les dynamiques et les enjeux (updated)", "localeCode": "fr"},
                {"value": u"Understanding the dynamics and issues (updated)", "localeCode": "en"}
             ],
             "typename": "negative",
             "totalNumber": 14,
             "color": "blue"
            }
        ]
    })

    assert res.errors is None
    assert json.loads(json.dumps(res.data)) == {
u'updateTokenVoteSpecification': {u'voteSpecification': {u'exclusiveCategories': True,
                                                         u'id': token_vote_spec_id,
                                                         u'instructionsEntries': [{u'localeCode': u'en',
                                                                                   u'value': u'Understanding the dynamics and issues (updated)'},
                                                                                  {u'localeCode': u'fr',
                                                                                   u'value': u'Comprendre les dynamiques et les enjeux (updated)'}],
                                                         u'titleEntries': [{u'localeCode': u'en',
                                                                            u'value': u'Understanding the dynamics and issues (updated)'},
                                                                           {u'localeCode': u'fr',
                                                                            u'value': u'Comprendre les dynamiques et les enjeux (updated)'}],
                                                         u'tokenCategories': [{u'color': u'blue',
                                                                               u'id': token_category_id,
                                                                               u'titleEntries': [{u'localeCode': u'en',
                                                                                                  u'value': u'Understanding the dynamics and issues (updated)'},
                                                                                                 {u'localeCode': u'fr',
                                                                                                  u'value': u'Comprendre les dynamiques et les enjeux (updated)'}],
                                                                               u'totalNumber': 14,
                                                                               u'typename': u'negative'}],
                                                         u'voteSessionId': vote_session_id}}}


def test_graphql_get_vote_session_and_vote_specifications(graphql_participant1_request, vote_session, token_vote_specification, graphql_registry):
    response = schema.execute(
        graphql_registry['VoteSession'],
        context_value=graphql_participant1_request,
        variable_values={
            "discussionPhaseId": vote_session.discussion_phase_id
        }
    )
    assert response.errors is None
    assert len(response.data['voteSession']['modules']) == 1
    assert 'tokenCategories' in response.data['voteSession']['modules'][0]


def test_mutation_create_gauge_vote_specification(graphql_request, vote_session, graphql_registry):
    mutation = graphql_registry['createGaugeVoteSpecification']
    vote_session_id = to_global_id("VoteSession", vote_session.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "voteSessionId": vote_session_id,
        "titleEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues", "localeCode": "en"}
        ],
        "instructionsEntries":
        [
            {"value": u"Comprendre les dynamiques et les enjeux", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues", "localeCode": "en"}
        ],
        "choices": [
            {"labelEntries": [
                {"value": u"Cran 1", "localeCode": "fr"},
                {"value": u"Tick 1", "localeCode": "en"}
             ],
             "value": 10.0,
            },
            {"labelEntries": [
                {"value": u"Cran 2", "localeCode": "fr"},
                {"value": u"Tick 2", "localeCode": "en"}
             ],
             "value": 20.0,
            }
        ]
    })
    assert res.errors is None
    vote_spec = vote_session.vote_specifications[0]
    vote_spec_id = to_global_id("GaugeVoteSpecification", vote_spec.id)
    choice1 = vote_spec.choices[0]
    choice1_id = to_global_id("GaugeChoiceSpecification", choice1.id)
    choice2 = vote_spec.choices[1]
    choice2_id = to_global_id("GaugeChoiceSpecification", choice2.id)
    assert json.loads(json.dumps(res.data)) == {
u'createGaugeVoteSpecification': {u'voteSpecification': {u'id': vote_spec_id,
                                                         u'instructionsEntries': [{u'localeCode': u'en',
                                                                                   u'value': u'Understanding the dynamics and issues'},
                                                                                  {u'localeCode': u'fr',
                                                                                   u'value': u'Comprendre les dynamiques et les enjeux'}],
                                                         u'titleEntries': [{u'localeCode': u'en',
                                                                            u'value': u'Understanding the dynamics and issues'},
                                                                           {u'localeCode': u'fr',
                                                                            u'value': u'Comprendre les dynamiques et les enjeux'}],
                                                         u'choices': [
                                                             {u'value': 10.0,
                                                              u'id': choice1_id,
                                                              u'labelEntries': [{u'localeCode': u'en',
                                                                                 u'value': u'Tick 1'},
                                                                                {u'localeCode': u'fr',
                                                                                 u'value': u'Cran 1'}],
                                                             },
                                                             {u'value': 20.0,
                                                              u'id': choice2_id,
                                                              u'labelEntries': [{u'localeCode': u'en',
                                                                                 u'value': u'Tick 2'},
                                                                                {u'localeCode': u'fr',
                                                                                 u'value': u'Cran 2'}],
                                                             },
                                                         ],
                                                         u'voteSessionId': vote_session_id}}}
    # remove created vote specification
    vote_session.vote_specifications.remove(vote_spec)
    vote_session.db.flush()


def test_mutation_delete_gauge_vote_specification(graphql_request, gauge_vote_specification, graphql_registry):
    mutation = graphql_registry['deleteVoteSpecification']
    vote_spec_id = to_global_id("GaugeVoteSpecification", gauge_vote_specification.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "id": vote_spec_id
    })
    assert res.errors is None
    assert True == res.data['deleteVoteSpecification']['success']


def test_mutation_update_gauge_vote_specification(graphql_request, vote_session, gauge_vote_specification, graphql_registry):
    mutation = graphql_registry['updateGaugeVoteSpecification']
    vote_session_id = to_global_id("VoteSession", vote_session.id)
    gauge_vote_spec_id = to_global_id("GaugeVoteSpecification", gauge_vote_specification.id)
    choice1 = gauge_vote_specification.choices[0]
    choice1_id = to_global_id("GaugeChoiceSpecification", choice1.id)
    choice2 = gauge_vote_specification.choices[1]
    choice2_id = to_global_id("GaugeChoiceSpecification", choice2.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "id": gauge_vote_spec_id,
        "titleEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux (updated)", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues (updated)", "localeCode": "en"}
        ],
        "instructionsEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux (updated)", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues (updated)", "localeCode": "en"}
        ],
        "choices": [
            {
             "id": choice1_id,
             "labelEntries": [
                {"value": u"Cran 1 (updated)", "localeCode": "fr"},
                {"value": u"Tick 1 (updated)", "localeCode": "en"}
             ],
             "value": 20.0,
            },
            {
             "id": choice2_id,
             "labelEntries": [
                {"value": u"Cran 2 (updated)", "localeCode": "fr"},
                {"value": u"Tick 2 (updated)", "localeCode": "en"}
             ],
             "value": 30.0,
            }
        ]
    })

    assert res.errors is None
    assert json.loads(json.dumps(res.data)) == {
u'updateGaugeVoteSpecification': {u'voteSpecification': {u'id': gauge_vote_spec_id,
                                                         u'instructionsEntries': [{u'localeCode': u'en',
                                                                                   u'value': u'Understanding the dynamics and issues (updated)'},
                                                                                  {u'localeCode': u'fr',
                                                                                   u'value': u'Comprendre les dynamiques et les enjeux (updated)'}],
                                                         u'titleEntries': [{u'localeCode': u'en',
                                                                            u'value': u'Understanding the dynamics and issues (updated)'},
                                                                           {u'localeCode': u'fr',
                                                                            u'value': u'Comprendre les dynamiques et les enjeux (updated)'}],
                                                         u'choices': [
                                                             {u'value': 20.0,
                                                              u'id': choice1_id,
                                                              u'labelEntries': [{u'localeCode': u'en',
                                                                                 u'value': u'Tick 1 (updated)'},
                                                                                {u'localeCode': u'fr',
                                                                                 u'value': u'Cran 1 (updated)'}],
                                                             },
                                                             {u'value': 30.0,
                                                              u'id': choice2_id,
                                                              u'labelEntries': [{u'localeCode': u'en',
                                                                                 u'value': u'Tick 2 (updated)'},
                                                                                {u'localeCode': u'fr',
                                                                                 u'value': u'Cran 2 (updated)'}],
                                                             },
                                                         ],
                                                         u'voteSessionId': vote_session_id}}}


def test_mutation_create_number_gauge_vote_specification(graphql_request, vote_session, graphql_registry):
    mutation = graphql_registry['createNumberGaugeVoteSpecification']
    vote_session_id = to_global_id("VoteSession", vote_session.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "voteSessionId": vote_session_id,
        "titleEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues", "localeCode": "en"}
        ],
        "instructionsEntries":
        [
            {"value": u"Comprendre les dynamiques et les enjeux", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues", "localeCode": "en"}
        ],
        "minimum": 0.0,
        "maximum": 60.0,
        "nbTicks": 7,
        "unit": u"M€"
    })
    assert res.errors is None
    vote_spec = vote_session.vote_specifications[0]
    vote_spec_id = to_global_id("NumberGaugeVoteSpecification", vote_spec.id)
    assert json.loads(json.dumps(res.data)) == {
u'createNumberGaugeVoteSpecification': {
    u'voteSpecification': {
        u'id': vote_spec_id,
        u'instructionsEntries': [
            {u'localeCode': u'en',
             u'value': u'Understanding the dynamics and issues'},
            {u'localeCode': u'fr',
             u'value': u'Comprendre les dynamiques et les enjeux'}],
        u'titleEntries': [
            {u'localeCode': u'en',
             u'value': u'Understanding the dynamics and issues'},
            {u'localeCode': u'fr',
             u'value': u'Comprendre les dynamiques et les enjeux'}],
        u"minimum": 0.0,
        u"maximum": 60.0,
        u"nbTicks": 7,
        u"unit": u"M€",
        u'voteSessionId': vote_session_id}}}
    # remove created vote specification
    vote_session.vote_specifications.remove(vote_spec)
    vote_session.db.flush()


def test_mutation_delete_number_gauge_vote_specification(graphql_request, number_gauge_vote_specification, graphql_registry):
    mutation = graphql_registry['deleteVoteSpecification']
    vote_spec_id = to_global_id("NumberGaugeVoteSpecification", number_gauge_vote_specification.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "id": vote_spec_id
    })
    assert res.errors is None
    assert True == res.data['deleteVoteSpecification']['success']


def test_mutation_update_number_gauge_vote_specification(graphql_request, vote_session, number_gauge_vote_specification, graphql_registry):
    mutation = graphql_registry['updateNumberGaugeVoteSpecification']
    vote_session_id = to_global_id("VoteSession", vote_session.id)
    gauge_vote_spec_id = to_global_id("NumberGaugeVoteSpecification", number_gauge_vote_specification.id)
    res = schema.execute(mutation, context_value=graphql_request, variable_values={
        "id": gauge_vote_spec_id,
        "titleEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux (updated)", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues (updated)", "localeCode": "en"}
        ],
        "instructionsEntries": [
            {"value": u"Comprendre les dynamiques et les enjeux (updated)", "localeCode": "fr"},
            {"value": u"Understanding the dynamics and issues (updated)", "localeCode": "en"}
        ],
        u"minimum": 1.0,
        u"maximum": 80.0,
        u"nbTicks": 8,
        u"unit": u"M$",
        u'voteSessionId': vote_session_id
    })

    assert res.errors is None
    assert json.loads(json.dumps(res.data)) == {
u'updateNumberGaugeVoteSpecification': {
    u'voteSpecification': {
        u'id': gauge_vote_spec_id,
        u'instructionsEntries': [
            {u'localeCode': u'en',
             u'value': u'Understanding the dynamics and issues (updated)'},
            {u'localeCode': u'fr',
             u'value': u'Comprendre les dynamiques et les enjeux (updated)'}],
        u'titleEntries': [
            {u'localeCode': u'en',
             u'value': u'Understanding the dynamics and issues (updated)'},
            {u'localeCode': u'fr',
             u'value': u'Comprendre les dynamiques et les enjeux (updated)'}],
        u"minimum": 1.0,
        u"maximum": 80.0,
        u"nbTicks": 8,
        u"unit": u"M$",
        u'voteSessionId': vote_session_id}}}
