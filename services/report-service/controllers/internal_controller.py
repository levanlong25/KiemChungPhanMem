# report-service/controllers/internal_controller.py
from functools import wraps
from flask import Blueprint, jsonify, request
import os
from services.report_service import ReportService

internal_bp = Blueprint('internal_api', __name__, url_prefix='/internal')


def internal_api_key_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            provided_key = request.headers.get('X-Internal-Api-Key')
            correct_key = os.environ.get('INTERNAL_API_KEY')
            if not correct_key:
                return jsonify(error="Configuration error"), 500
            if provided_key == correct_key:
                return fn(*args, **kwargs)
            return jsonify(error="Unauthorized"), 403
        return decorator
    return wrapper


@internal_bp.route("/reports", methods=["GET"])
@internal_api_key_required()
def get_all_reports():
    status_filter = request.args.get('status')
    reports = ReportService.get_all_reports(status_filter=status_filter)
    return jsonify([r.to_dict() for r in reports]), 200


@internal_bp.route("/reports/<int:report_id>/status", methods=["PUT"])
@internal_api_key_required()
def update_report_status(report_id):
    data = request.get_json()
    if not data:
        return jsonify(error="Missing JSON body"), 400

    new_status = data.get('status')
    if not new_status:
        return jsonify(error="Missing status"), 400

    report, message = ReportService.update_report_status(report_id, new_status)
    if not report:
        return jsonify(error=message), 400
    return jsonify(message=message, report=report.to_dict()), 200


@internal_bp.route("/reports/by-reporter/<int:user_id>", methods=["GET"])
@internal_api_key_required()
def get_reporter_reports(user_id):
    reports = ReportService.get_reports_by_reporter(user_id)
    return jsonify([r.to_dict() for r in reports]), 200

