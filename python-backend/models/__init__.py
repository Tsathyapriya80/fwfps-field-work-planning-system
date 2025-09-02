# Initialize models module
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

def init_models(db: SQLAlchemy, ma: Marshmallow):
    """Initialize all models with database and marshmallow instances"""
    
    # Set global db and ma for all model modules
    import models.user as user_module
    import models.workplan as workplan_module
    import models.pac_operation as pac_module
    
    user_module.db = db
    user_module.ma = ma
    workplan_module.db = db
    workplan_module.ma = ma
    pac_module.db = db
    pac_module.ma = ma
