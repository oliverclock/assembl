import graphene
from graphene.relay import Node
from graphene_sqlalchemy import SQLAlchemyObjectType

from assembl import models
from assembl.auth import CrudPermissions
from assembl.auth.util import get_permissions
from .permissions_helpers import (
    require_cls_permission, require_instance_permission)
from .types import SecureObjectType, SQLAlchemyUnion
from .utils import DateTime, abort_transaction_on_exception
from .vote_session import TokenVoteSpecification, VoteSpecificationUnion


class VoteInterface(graphene.Interface):

    vote_date = DateTime(required=True)
    voter_id = graphene.ID(required=True)
    vote_spec_id = graphene.ID(required=True)
    proposal_id = graphene.ID(required=True)

    def resolve_voter_id(self, args, context, info):
        return Node.to_global_id('AgentProfile', self.voter_id)

    def resolve_vote_spec_id(self, args, context, info):
        return Node.to_global_id(self.vote_spec.__class__.__name__, self.vote_spec_id)

    def resolve_proposal_id(self, args, context, info):
        return Node.to_global_id('Idea', self.idea_id)


class TokenVote(SecureObjectType, SQLAlchemyObjectType):

    class Meta:
        model = models.TokenIdeaVote
        interfaces = (Node, VoteInterface)
        only_fields = ('id', 'vote_value')

    token_category_id = graphene.ID(required=True)

    def resolve_token_category_id(self, args, context, info):
        return Node.to_global_id('TokenCategorySpecification', self.token_category_id)


class GaugeVote(SecureObjectType, SQLAlchemyObjectType):

    class Meta:
        model = models.GaugeIdeaVote
        interfaces = (Node, VoteInterface)
        only_fields = ('id', 'vote_value')


class VoteUnion(SQLAlchemyUnion):
    class Meta:
        types = (TokenVote, GaugeVote)
        model = models.AbstractIdeaVote

    @classmethod
    def resolve_type(cls, instance, context, info):
        if isinstance(instance, graphene.ObjectType):
            return type(instance)
        elif isinstance(instance, models.TokenIdeaVote):
            return TokenVote
        elif isinstance(instance, models.GaugeIdeaVote):
            return GaugeVote


class AddTokenVote(graphene.Mutation):
    class Input:
        proposal_id = graphene.ID(required=True)
        token_category_id = graphene.ID(required=True)
        vote_spec_id = graphene.ID(required=True)
        vote_value = graphene.Int(required=True)

    vote_specification = graphene.Field(lambda: TokenVoteSpecification)

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        require_cls_permission(CrudPermissions.CREATE, models.TokenIdeaVote, context)
        discussion_id = context.matchdict['discussion_id']
        discussion = models.Discussion.get(discussion_id)
        user_id = context.authenticated_userid

        vote_value = args.get('vote_value')
        proposal_id = args.get('proposal_id')
        proposal_id = int(Node.from_global_id(proposal_id)[1])
        proposal = models.Idea.get(proposal_id)

        token_category_id = args.get('token_category_id')
        token_category_id = int(Node.from_global_id(token_category_id)[1])
        token_category = models.TokenCategorySpecification.get(token_category_id)

        vote_spec_id = args.get('vote_spec_id')
        vote_spec_id = int(Node.from_global_id(vote_spec_id)[1])
        vote_spec = models.AbstractVoteSpecification.get(vote_spec_id)

        vote = models.TokenIdeaVote.query.filter_by(
            vote_spec_id=vote_spec.id, tombstone_date=None, voter_id=user_id,
            token_category_id=token_category_id).first()
        if vote_value == 0:
            if vote is not None:
                vote.is_tombstone = True
        else:
            if vote is None or vote.vote_value != vote_value:
                vote = models.TokenIdeaVote(
                    discussion=discussion,
                    vote_spec=vote_spec,
                    widget=vote_spec.widget,
                    voter_id=user_id,
                    idea=proposal,
                    vote_value=vote_value,
                    token_category=token_category)
                permissions = get_permissions(user_id, discussion_id)
                vote = vote.handle_duplication(
                    permissions=permissions, user_id=user_id)
                vote.db.add(vote)

        vote.db.flush()
        return AddTokenVote(vote_specification=vote_spec)


class DeleteTokenVote(graphene.Mutation):
    class Input:
        proposal_id = graphene.ID(required=True)
        token_category_id = graphene.ID(required=True)
        vote_spec_id = graphene.ID(required=True)

    vote_specification = graphene.Field(lambda: TokenVoteSpecification)

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        user_id = context.authenticated_userid

        proposal_id = args.get('proposal_id')
        proposal_id = int(Node.from_global_id(proposal_id)[1])

        token_category_id = args.get('token_category_id')
        token_category_id = int(Node.from_global_id(token_category_id)[1])

        vote_spec_id = args.get('vote_spec_id')
        vote_spec_id = int(Node.from_global_id(vote_spec_id)[1])
        vote_spec = models.AbstractVoteSpecification.get(vote_spec_id)

        vote = models.TokenIdeaVote.query.filter_by(
            vote_spec_id=vote_spec.id, tombstone_date=None, voter_id=user_id,
            token_category_id=token_category_id).one()

        require_instance_permission(CrudPermissions.DELETE, vote, context)
        vote.is_tombstone = True
        vote.db.flush()
        return DeleteTokenVote(vote_specification=vote_spec)


class AddGaugeVote(graphene.Mutation):
    class Input:
        proposal_id = graphene.ID(required=True)
        vote_spec_id = graphene.ID(required=True)
        vote_value = graphene.Float(required=True)

    vote_specification = graphene.Field(lambda: VoteSpecificationUnion)  # need to match GaugeVoteSpecification / NumberGaugeVoteSpecification

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        require_cls_permission(CrudPermissions.CREATE, models.TokenIdeaVote, context)
        discussion_id = context.matchdict['discussion_id']
        discussion = models.Discussion.get(discussion_id)
        user_id = context.authenticated_userid
        vote_value = args.get('vote_value')

        proposal_id = args.get('proposal_id')
        proposal_id = int(Node.from_global_id(proposal_id)[1])
        proposal = models.Idea.get(proposal_id)

        vote_spec_id = args.get('vote_spec_id')
        vote_spec_id = int(Node.from_global_id(vote_spec_id)[1])
        vote_spec = models.AbstractVoteSpecification.get(vote_spec_id)

        vote = models.GaugeIdeaVote.query.filter_by(
            vote_spec_id=vote_spec.id, tombstone_date=None, voter_id=user_id).first()
        if vote_value == 0:
            if vote is not None:
                vote.is_tombstone = True
        else:
            if vote is None or vote.vote_value != vote_value:
                vote = models.GaugeIdeaVote(
                    discussion=discussion,
                    vote_spec=vote_spec,
                    widget=vote_spec.widget,
                    voter_id=user_id,
                    idea=proposal,
                    vote_value=vote_value)

                permissions = get_permissions(user_id, discussion_id)
                vote = vote.handle_duplication(
                    permissions=permissions, user_id=user_id)
                vote.db.add(vote)
        vote.db.flush()
        return AddGaugeVote(vote_specification=vote_spec)


class DeleteGaugeVote(graphene.Mutation):
    class Input:
        proposal_id = graphene.ID(required=True)
        vote_spec_id = graphene.ID(required=True)

    vote_specification = graphene.Field(lambda: VoteSpecificationUnion)  # need to match GaugeVoteSpecification / NumberGaugeVoteSpecification

    @staticmethod
    @abort_transaction_on_exception
    def mutate(root, args, context, info):
        user_id = context.authenticated_userid

        proposal_id = args.get('proposal_id')
        proposal_id = int(Node.from_global_id(proposal_id)[1])

        vote_spec_id = args.get('vote_spec_id')
        vote_spec_id = int(Node.from_global_id(vote_spec_id)[1])
        vote_spec = models.AbstractVoteSpecification.get(vote_spec_id)

        vote = models.GaugeIdeaVote.query.filter_by(
            vote_spec_id=vote_spec.id, tombstone_date=None, voter_id=user_id).one()

        require_instance_permission(CrudPermissions.DELETE, vote, context)
        vote.is_tombstone = True
        vote.db.flush()
        return DeleteGaugeVote(vote_specification=vote_spec)
