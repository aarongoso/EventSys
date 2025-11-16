class EventPolicy < ApplicationPolicy

  # Anyone can see events
  def index?
    true
  end

  def show?
    true
  end

  # Only logged in users can create
  def create?
    user.present?
  end

  # Only admins OR the event owner can edit/update
  def edit?
    user_is_owner_or_admin?
  end

  def update?
    user_is_owner_or_admin?
  end

  # Only admins OR the event owner can delete
  def destroy?
    user_is_owner_or_admin?
  end

  # Pundit requires a Scope class to define what index loads
  class Scope < Scope
    def resolve
      # All events are visible to all users
      scope.all
    end
  end

  private

  # Helper method
  def user_is_owner_or_admin?
    return false unless user.present?
    user.role == "admin" || record.user_id == user.id
  end

end
