class ApplicationController < ActionController::Base
  # Devise permits extra fields
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Pundit for authorization
  include Pundit
  # verify_authorized: all actions EXCEPT index must call `authorize`
  # verify_policy_scoped: index actions must call `policy_scope`
  # disable these for Devise controllers and for JSON API requests
  after_action :verify_authorized, except: :index, unless: :skip_pundit?
  after_action :verify_policy_scoped, only: :index, unless: :skip_pundit?

  # Handle authorization failures
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  # Redirect after login
  def after_sign_in_path_for(resource)
    events_path
  end

  # Redirect after logout
  def after_sign_out_path_for(resource_or_scope)
    new_user_session_path
  end

  protected

  # Permit name + role for Devise (signup & account edit)
  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :role])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :role])
  end

  private

  # Skip Pundit verification for:
  # Devise controllers
  # Rails internal controllers
  # JSON API requests (React frontend)
  def skip_pundit?
    devise_controller? ||
      params[:controller].start_with?("rails/") ||
      request.format.json?
  end

  # Flash message for unauthorized actions
  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_to(request.referer || root_path)
  end
end