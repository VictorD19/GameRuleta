"""Modelos para las Transacciones

Revision ID: b9f5376704f3
Revises: d8089d4e5d4d
Create Date: 2023-11-18 12:35:51.220174

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b9f5376704f3'
down_revision: Union[str, None] = 'd8089d4e5d4d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('transaccionesEntrada',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('usuario', sa.Integer(), nullable=False),
    sa.Column('idExterno', sa.String(), nullable=True),
    sa.Column('monto', sa.Float(), nullable=True),
    sa.Column('fechaCreado', sa.DateTime(), nullable=False),
    sa.Column('fechaPagado', sa.DateTime(), nullable=True),
    sa.Column('status', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['usuario'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transaccionesSalida',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('usuario', sa.Integer(), nullable=False),
    sa.Column('idExterno', sa.String(), nullable=True),
    sa.Column('monto', sa.Float(), nullable=True),
    sa.Column('fechaCreado', sa.DateTime(), nullable=False),
    sa.Column('fechaPagado', sa.DateTime(), nullable=True),
    sa.Column('status', sa.Boolean(), nullable=False),
    sa.ForeignKeyConstraint(['usuario'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('transaccionesSalida')
    op.drop_table('transaccionesEntrada')
    # ### end Alembic commands ###
