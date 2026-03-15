from app import db
from datetime import datetime, timezone

class Report(db.Model):
    __tablename__ = 'reports'

    report_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    reporter_id = db.Column(db.Integer, nullable=False)
    transaction_id = db.Column(db.Integer, nullable=False)
    reported_user_id = db.Column(db.Integer, nullable=False)
    reason = db.Column(db.String(100), nullable=False)
    details = db.Column(db.Text, nullable=True)
    status = db.Column(db.Enum('pending', 'reviewed', 'resolved', 'dismissed', name='report_status_enum'), default='pending', nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        db.UniqueConstraint('transaction_id', 'reporter_id', name='unique_report_per_transaction'),
    )

    def __repr__(self):
        return f"<Report {self.report_id} - TXN:{self.transaction_id} - Reporter:{self.reporter_id}>"

    def to_dict(self):
        return {
            'report_id': self.report_id,
            'reporter_id': self.reporter_id,
            'transaction_id': self.transaction_id,
            'reported_user_id': self.reported_user_id,
            'reason': self.reason,
            'details': self.details,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }