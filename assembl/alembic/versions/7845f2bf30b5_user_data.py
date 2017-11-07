"""user_data

Revision ID: 7845f2bf30b5
Revises: bf6d8d4d2aff
Create Date: 2017-11-07 10:59:46.660585

"""

# revision identifiers, used by Alembic.
revision = '7845f2bf30b5'
down_revision = 'bf6d8d4d2aff'

from alembic import context, op
import sqlalchemy as sa
import transaction


from assembl.lib import config


def upgrade(pyramid_env):
    with context.begin_transaction():
        op.add_column('user', sa.Column('country', sa.String(2)))
        op.add_column('user', sa.Column('city', sa.Unicode))
        op.add_column('user', sa.Column('org_unit', sa.Unicode))
        op.add_column('user', sa.Column('org_title', sa.Unicode))


def downgrade(pyramid_env):
    with context.begin_transaction():
        op.drop_column('user', 'country')
        op.drop_column('user', 'city')
        op.drop_column('user', 'org_unit')
        op.drop_column('user', 'org_title')
