"""create user allergy table

Revision ID: 27ba9917b2d7
Revises: 78daa36c05b2
Create Date: 2026-11-17 11:40:13.222697

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '27ba9917b2d7'
down_revision: Union[str, Sequence[str], None] = '78daa36c05b2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create the user_allergy table
    op.create_table(
        'user_allergy',
        sa.Column('allergy_id', sa.Integer(), primary_key=True),
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('app_user.id', ondelete='CASCADE'), nullable=False),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('reaction', sa.Text(), nullable=False),
        sa.Column('severity', sa.String(length=20), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False)
    )


def downgrade() -> None:
    # Remove the user_allergy table
    op.drop_table('user_allergy')
