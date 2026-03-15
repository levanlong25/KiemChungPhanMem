# services/report_service.py
from models.report import Report
from app import db
from sqlalchemy.exc import IntegrityError


class ReportService:

    @staticmethod
    def create_report(transaction_id, reporter_id, reported_user_id, reason, details=None):
        try:
            if reporter_id == reported_user_id:
                return None, "duplicate"
            
            existing = Report.query.filter_by(
                transaction_id=transaction_id,
                reporter_id=reporter_id
            ).first()
            if existing:
                return None, "duplicate"

            report = Report(
                transaction_id=transaction_id,
                reporter_id=reporter_id,
                reported_user_id=reported_user_id,
                reason=reason,
                details=details,
                status='pending'
            )
            db.session.add(report)
            db.session.commit()
            return report, None

        except IntegrityError:
            db.session.rollback()
            return None, "duplicate"
        except Exception:
            db.session.rollback()
            return None, "error"

    @staticmethod
    def get_reports_by_transaction(transaction_id):
        return Report.query.filter_by(transaction_id=transaction_id).order_by(Report.created_at.desc()).all()

    @staticmethod
    def get_reports_about_user(user_id):
        return Report.query.filter_by(reported_user_id=user_id).order_by(Report.created_at.desc()).all()

    @staticmethod
    def get_reports_by_reporter(user_id):
        return Report.query.filter_by(reporter_id=user_id).order_by(Report.created_at.desc()).all()

    @staticmethod
    def delete_report(report_id, user_id):
        report = Report.query.get(report_id)
        if not report:
            return False, "Not found", 404
        if report.reporter_id != user_id:
            return False, "Unauthorized", 403
        try:
            db.session.delete(report)
            db.session.commit()
            return True, "Deleted", 200
        except Exception:
            db.session.rollback()
            return False, "Error", 500

    @staticmethod
    def get_all_reports(status_filter=None):
        query = Report.query.order_by(Report.created_at.desc())
        if status_filter in ['pending', 'reviewed', 'resolved', 'dismissed']:
            query = query.filter_by(status=status_filter)
        return query.all()

    @staticmethod
    def update_report_status(report_id, new_status):
        report = Report.query.get(report_id)
        if not report:
            return None, "Not found"
        if new_status not in ['pending', 'reviewed', 'resolved', 'dismissed']:
            return None, "Invalid status"
        try:
            report.status = new_status
            db.session.commit()
            return report, "Updated"
        except Exception:
            db.session.rollback()
            return None, "Error"

