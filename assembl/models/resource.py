from sqlalchemy import (
    Column,
    Integer,
    String,
    UnicodeText,
    ForeignKey,
)
from sqlalchemy.orm import relationship, backref

from .auth import CrudPermissions, P_MANAGE_RESOURCE, P_READ
from . import DiscussionBoundBase, HistoryMixin
from .attachment import Document
from .langstrings import LangString


class Resource(HistoryMixin, DiscussionBoundBase):

    """Resource for resources center."""

    __tablename__ = "resource"
    sqla_type = Column(String(60), nullable=False)
    rdf_type = Column(
        String(60), nullable=False, server_default='resource:GenericResourceNode')

    id = Column(Integer, ForeignKey(
        'content.id',
        ondelete='CASCADE',
        onupdate='CASCADE'
    ), primary_key=True)

    discussion_id = Column(
        Integer,
        ForeignKey(
            'discussion.id',
            ondelete='CASCADE',
            onupdate='CASCADE',
        ),
        nullable=False, index=True)


    discussion = relationship(
        "Discussion",
        backref=backref(
            'resources',
            cascade="all, delete-orphan"),
    )

    title_id = Column(
        Integer(), ForeignKey(LangString.id))
    text_id = Column(
        Integer(), ForeignKey(LangString.id))
    title = relationship(
        LangString,
        lazy="joined", single_parent=True,
        primaryjoin=title_id == LangString.id,
        backref=backref("resource_from_title", lazy="dynamic"),
        cascade="all, delete-orphan")
    text = relationship(
        LangString,
        lazy="joined", single_parent=True,
        primaryjoin=text_id == LangString.id,
        backref=backref("resource_from_text", lazy="dynamic"),
        cascade="all, delete-orphan")

    embed_code = Column(UnicodeText)

    document_id = Column(
        Integer,
        ForeignKey(
            'document.id',
            ondelete='CASCADE',
            onupdate='CASCADE',
        ),
        nullable=False)

    document = relationship(
        Document,
        backref=backref(
            'document'),
    )


    image = Column(
        Integer,
        ForeignKey(
            'image.id',
            ondelete='CASCADE',
            onupdate='CASCADE',
        ),
        nullable=False)

    image = relationship(
        Document,
        backref=backref(
            'image'),
    )

    def get_discussion_id(self):
        return self.discussion_id or self.discussion.id

    @classmethod
    def get_discussion_conditions(cls, discussion_id, alias_maker=None):
        return (cls.discussion_id == discussion_id,)

    crud_permissions = CrudPermissions(
        P_MANAGE_RESOURCE, P_READ, P_MANAGE_RESOURCE, P_MANAGE_RESOURCE,
        P_MANAGE_RESOURCE, P_MANAGE_RESOURCE)