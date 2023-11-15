"""initial

Revision ID: 34f7af131eaa
Revises: 
Create Date: 2023-11-15 19:31:29.984731

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '34f7af131eaa'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('mesas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('numero', sa.Integer(), nullable=False),
    sa.Column('status', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('avatar', sa.String(), nullable=True),
    sa.Column('account', sa.Float(), nullable=False),
    sa.Column('status', sa.Boolean(), nullable=False),
    sa.Column('codreferencia', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('jugadas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('mesa', sa.Integer(), nullable=False),
    sa.Column('ladoA', sa.Float(), nullable=True),
    sa.Column('ladoB', sa.Float(), nullable=True),
    sa.Column('ladoGanador', sa.Integer(), nullable=True),
    sa.Column('creacion', sa.DateTime(), nullable=False),
    sa.Column('inicio', sa.DateTime(), nullable=True),
    sa.Column('fin', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['mesa'], ['mesas.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('apuestas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('jugada', sa.Integer(), nullable=False),
    sa.Column('usuario', sa.Integer(), nullable=False),
    sa.Column('monto', sa.Float(), nullable=False),
    sa.Column('montoResultado', sa.Float(), nullable=True),
    sa.Column('porcentaje', sa.Float(), nullable=False),
    sa.Column('lado', sa.Integer(), nullable=False),
    sa.Column('fecha', sa.DateTime(), nullable=False),
    sa.Column('resultado', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['jugada'], ['jugadas.id'], ),
    sa.ForeignKeyConstraint(['usuario'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('apuestas')
    op.drop_table('jugadas')
    op.drop_table('users')
    op.drop_table('mesas')
    # ### end Alembic commands ###
