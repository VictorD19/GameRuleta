"""Init DB

Revision ID: a8112c47255d
Revises: 
Create Date: 2023-12-02 19:35:07.624362

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a8112c47255d'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('mesas',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('numero', sa.Integer(), nullable=False),
    sa.Column('status', sa.Boolean(), nullable=False),
    sa.Column('minimo', sa.Integer(), nullable=True),
    sa.Column('maximo', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('password', sa.String(), nullable=False),
    sa.Column('avatar', sa.String(), nullable=True),
    sa.Column('account', sa.Float(), nullable=False),
    sa.Column('ganancias', sa.Float(), nullable=True),
    sa.Column('status', sa.Boolean(), nullable=False),
    sa.Column('codreferencia', sa.String(), nullable=True),
    sa.Column('codIndicacion', sa.String(), nullable=True),
    sa.Column('dataCriacion', sa.DateTime(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
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
    sa.Column('ruleta', sa.String(), nullable=True),
    sa.ForeignKeyConstraint(['mesa'], ['mesas.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
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
    op.drop_table('transaccionesSalida')
    op.drop_table('transaccionesEntrada')
    op.drop_table('jugadas')
    op.drop_table('users')
    op.drop_table('mesas')
    # ### end Alembic commands ###