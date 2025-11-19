class ApplicationController < ActionController::Base
  # Devise permits extra fields
  before_action :configure_permitted_parameters, if: :devise_controller?

  # Pundit for authorization (but NO global after_actions here)
  include Pundit::Authorization

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
    devise_parameter_sanitizer.permit(:sign_up, keys: [ :name, :role ])
    devise_parameter_sanitizer.permit(:account_update, keys: [ :name, :role ])
  end

  private

  # Flash message for unauthorized actions
  def user_not_authorized
    flash[:alert] = "You are not authorized to perform this action."
    redirect_to(request.referer || root_path)
  end
end
