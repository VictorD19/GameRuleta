"""Tabela Minas

Revision ID: e1f34514de64
Revises: 27f998c08ee9
Create Date: 2023-12-28 05:12:49.800817

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1f34514de64'
down_revision: Union[str, None] = '27f998c08ee9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('apuestas_minas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('usuario', sa.Integer(), nullable=False),
    sa.Column('gastoAccount', sa.Float(), nullable=True),
    sa.Column('gastoGanancia', sa.Float(), nullable=True),
    sa.Column('resultado', sa.Boolean(), nullable=True),
    sa.Column('montoResultado', sa.Float(), nullable=True),
    sa.Column('abiertas', sa.String(), nullable=True),
    sa.Column('fin', sa.DateTime(), nullable=True),
    sa.Column('minas', sa.Integer(), nullable=False),
    sa.Column('monto', sa.Float(), nullable=False),
    sa.Column('matriz', sa.String(), nullable=False),
    sa.Column('inicio', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['usuario'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('apuestas_minas')
    # ### end Alembic commands ###
