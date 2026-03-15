# report-service/app.py
import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate

load_dotenv()

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate(version_table='alembic_version_reports')


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "a_very_secret_key")

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from controllers.report_controller import report_api
    from controllers.internal_controller import internal_bp
    app.register_blueprint(internal_bp)
    app.register_blueprint(report_api)

    return app
