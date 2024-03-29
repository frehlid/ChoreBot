"""changed group to string

Revision ID: f910e262fd5a
Revises: 2bae8e2c7bcd
Create Date: 2024-03-12 22:44:43.613135

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision = 'f910e262fd5a'
down_revision = '2bae8e2c7bcd'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chore', schema=None) as batch_op:
        batch_op.alter_column('group',
               existing_type=sqlite.JSON(),
               type_=sa.String(length=128),
               existing_nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('chore', schema=None) as batch_op:
        batch_op.alter_column('group',
               existing_type=sa.String(length=128),
               type_=sqlite.JSON(),
               existing_nullable=True)

    # ### end Alembic commands ###
