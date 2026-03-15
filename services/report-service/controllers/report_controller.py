# controllers/report_controller.py
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.report_service import ReportService

report_api = Blueprint('report_api', __name__, url_prefix='/api')


@report_api.route('/reports', methods=['POST'])
@jwt_required()
def create_report():
    try:
        reporter_id = int(get_jwt_identity())
    except (ValueError, TypeError):
        return jsonify(error="Invalid user ID"), 401

    data = request.get_json()
    if not data:
        return jsonify(error="Missing JSON body"), 400

    transaction_id = data.get('transaction_id')
    reported_user_id = data.get('reported_user_id')
    reason = data.get('reason')
    details = data.get('details')

    if not transaction_id or not reported_user_id or not reason:
        return jsonify(error="Missing required fields"), 400
    
    if not isinstance(reason, str) or len(reason) > 100:
        return jsonify(error="Reason must be string max 100 chars"), 400

    report, error_type = ReportService.create_report(
        transaction_id=transaction_id,
        reporter_id=reporter_id,
        reported_user_id=reported_user_id,
        reason=reason,
        details=details
    )

    if not report:
        status = 409 if error_type == "duplicate" else 400
        return jsonify(error="Cannot create report"), status
    return jsonify(report=report.to_dict()), 201


@report_api.route('/reports/<int:report_id>', methods=['DELETE'])
@jwt_required()
def delete_report(report_id):
    try:
        user_id = int(get_jwt_identity())
    except (ValueError, TypeError):
        return jsonify(error="Invalid user ID"), 401

    success, message, status_code = ReportService.delete_report(report_id, user_id)
    if not success:
        return jsonify(error=message), status_code
    return jsonify(message=message), 200


@report_api.route('/reports/transaction/<int:transaction_id>', methods=['GET'])
def get_transaction_reports(transaction_id):
    reports = ReportService.get_reports_by_transaction(transaction_id)
    return jsonify([r.to_dict() for r in reports]), 200


@report_api.route('/reports/reported-user/<int:user_id>', methods=['GET'])
def get_user_reports(user_id):
    reports = ReportService.get_reports_about_user(user_id)
    return jsonify([r.to_dict() for r in reports]), 200


@report_api.route('/reports/my-reports', methods=['GET'])
@jwt_required()
def get_my_reports():
    try:
        user_id = int(get_jwt_identity())
    except (ValueError, TypeError):
        return jsonify(error="Invalid user ID"), 401

    reports = ReportService.get_reports_by_reporter(user_id)
    return jsonify([r.to_dict() for r in reports]), 200

