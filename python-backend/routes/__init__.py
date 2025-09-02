# Initialize routes module
from .auth_routes import auth_bp
from .workplan_routes import workplan_bp
from .pac_routes import pac_bp

__all__ = ['auth_bp', 'workplan_bp', 'pac_bp']
