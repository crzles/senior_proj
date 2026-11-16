"""match tables to frontend

Brings the database in line with the models updated to match the frontend:
- medications: new schedule columns from the Add Medication form
- dose_logs: rebuilt for the home page checkmarks (med + date + time)
- symptom_logs: rebuilt for the Symptom log form (symptom, date, time, severity...)
- symptoms table removed (reminders is kept)
- refills.qty_added can hold more than 9.99
- app_user.timezone added if it's missing

dose_logs and symptom_logs are dropped and recreated, so their rows (test data) are deleted.

Revision ID: 78daa36c05b2
Revises: 45496980f3cc
Create Date: 2026-11-16 13:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '78daa36c05b2'
down_revision: Union[str, Sequence[str], None] = '45496980f3cc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # old tables that were rebuilt or removed
    op.drop_table('dose_logs')
    op.drop_table('symptom_logs')
    op.drop_table('symptoms')

    # medications: schedule details from the Add Medication form
    op.add_column('medications', sa.Column('reminder_times', postgresql.ARRAY(sa.String(length=5)), server_default=sa.text("'{}'"), nullable=False))
    op.add_column('medications', sa.Column('interval_hours', sa.Integer(), nullable=True))
    op.add_column('medications', sa.Column('interval_days', sa.Integer(), nullable=True))
    op.add_column('medications', sa.Column('first_dose_time', sa.String(length=5), nullable=True))
    op.add_column('medications', sa.Column('weekly_day', sa.String(length=10), nullable=True))
    op.add_column('medications', sa.Column('custom_days', postgresql.ARRAY(sa.String(length=10)), server_default=sa.text("'{}'"), nullable=False))
    op.add_column('medications', sa.Column('custom_times', postgresql.ARRAY(sa.String(length=5)), server_default=sa.text("'{}'"), nullable=False))

    # refills: a refill of 30 pills didn't fit in Numeric(3, 2)
    op.alter_column('refills', 'qty_added',
               existing_type=sa.NUMERIC(precision=3, scale=2),
               type_=sa.Numeric(precision=7, scale=2),
               existing_nullable=False)

    # app_user.timezone is in the model but no earlier migration added it
    op.execute("ALTER TABLE app_user ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'UTC' NOT NULL")

    # home page checkmarks: one row per dose marked taken
    op.create_table('dose_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('med_id', sa.Integer(), nullable=False),
    sa.Column('dose_date', sa.Date(), nullable=False),
    sa.Column('dose_time', sa.String(length=5), nullable=False),
    sa.Column('taken_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.ForeignKeyConstraint(['med_id'], ['medications.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('med_id', 'dose_date', 'dose_time', name='unique_dose_logs_med_date_time')
    )

    # Symptom log page entries
    op.create_table('symptom_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('symptom', sa.Text(), nullable=False),
    sa.Column('date', sa.Date(), nullable=False),
    sa.Column('time', sa.Time(), nullable=False),
    sa.Column('severity', sa.String(length=10), nullable=False),
    sa.Column('duration', sa.Text(), server_default=sa.text("''"), nullable=False),
    sa.Column('notes', sa.Text(), server_default=sa.text("''"), nullable=False),
    sa.Column('logged_at', sa.TIMESTAMP(timezone=True), server_default=sa.text('now()'), nullable=False),
    sa.CheckConstraint("severity IN ('Mild', 'Moderate', 'Severe')", name='check_symptom_logs_severity'),
    sa.ForeignKeyConstraint(['user_id'], ['app_user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('symptom_logs')
    op.drop_table('dose_logs')

    # timezone is left in place (an earlier setup may have created it)

    op.alter_column('refills', 'qty_added',
               existing_type=sa.Numeric(precision=7, scale=2),
               type_=sa.NUMERIC(precision=3, scale=2),
               existing_nullable=False)

    op.drop_column('medications', 'custom_times')
    op.drop_column('medications', 'custom_days')
    op.drop_column('medications', 'weekly_day')
    op.drop_column('medications', 'first_dose_time')
    op.drop_column('medications', 'interval_days')
    op.drop_column('medications', 'interval_hours')
    op.drop_column('medications', 'reminder_times')

    # old tables, as in the initial migration
    op.create_table('symptoms',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Text(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('name')
    )
    op.create_table('symptom_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('symptom_id', sa.Integer(), nullable=False),
    sa.Column('med_id', sa.Integer(), nullable=True),
    sa.Column('logged_on', sa.Date(), server_default=sa.text('CURRENT_DATE'), nullable=False),
    sa.Column('note', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['med_id'], ['medications.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['symptom_id'], ['symptoms.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['app_user.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('dose_logs',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('reminder_id', sa.Integer(), nullable=False),
    sa.Column('scheduled_for', sa.TIMESTAMP(timezone=True), nullable=False),
    sa.Column('status', sa.String(length=10), server_default='pending', nullable=False),
    sa.Column('remind_count', sa.Integer(), server_default=sa.text('0'), nullable=False),
    sa.Column('taken_at', sa.TIMESTAMP(timezone=True), nullable=True),
    sa.CheckConstraint("status IN ('pending', 'taken', 'skipped', 'missed')", name='check_dose_logs_status'),
    sa.CheckConstraint('remind_count BETWEEN 0 AND 4', name='check_dose_logs_remind_count'),
    sa.ForeignKeyConstraint(['reminder_id'], ['reminders.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('reminder_id', 'scheduled_for', name='unique_dose_logs_reminder_time')
    )
