from assembl.models import Discussion, LangString, Role, UserTemplate
from assembl.auth import R_PARTICIPANT


def test_add_discussion(test_session):
    d = Discussion(
        topic=u"Education", slug="education",
        subscribe_to_notifications_on_signup=False,
        creator=None,
        session=test_session)
    d.discussion_locales = ['en', 'fr', 'de']
    d.terms_and_conditions = LangString.create(
        u"Use the haptic JSON system, then you can quantify the cross-platform capacitor!", "en")
    d.legal_notice = LangString.create(
        u"Use the optical SCSI microchip, then you can generate the cross-platform pixel!", "en")
    assert d.topic == u"Education"
    assert d.discussion_locales == ['en', 'fr', 'de']
    assert d.terms_and_conditions.entries[0].value == u"Use the haptic JSON system, then you can quantify the cross-platform capacitor!"  # noqa: E501
    assert d.legal_notice.entries[0].value == u"Use the optical SCSI microchip, then you can generate the cross-platform pixel!"  # noqa: E501

def test_adding_a_discussion_automatically_adds_participant_user_template_for_notifications(test_session):
    discussion = Discussion(
        topic=u"How great is Assembl's notification architecture?", slug="notification-architecture",
        subscribe_to_notifications_on_signup=True,
        creator=None,
        session=test_session)

    # Creation of a discussion includes automatic creation of a default user template for role participant on this discussion, which is meant to be used for default notification subscriptions
    assert len(discussion.user_templates) > 0
    participant_role = test_session.query(Role).filter_by(name=R_PARTICIPANT).one()
    user_templates_for_role_participant = test_session.query(UserTemplate).filter_by(discussion=discussion, for_role=participant_role).all()
    assert len(user_templates_for_role_participant) > 0
