"""Columnas Tabela Mesas Maximo y minimo

Revision ID: 507d44237fa5
Revises: 34f7af131eaa
Create Date: 2023-11-15 21:33:56.704810

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '507d44237fa5'
down_revision: Union[str, None] = '34f7af131eaa'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('mesas', sa.Column('minimo', sa.Integer(), nullable=True))
    op.add_column('mesas', sa.Column('maximo', sa.Integer(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('mesas', 'maximo')
    op.drop_column('mesas', 'minimo')
    # ### end Alembic commands ###