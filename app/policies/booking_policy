class BookingPolicy < ApplicationPolicy

  # Anyone logged in can create a booking
  def create?
    user.present?
  end

  # Users can only see their own bookings, admins can see all
  def show?
    user_is_owner_or_admin?
  end

  # Users can only edit their own bookings
  def update?
    user_is_owner_or_admin?
  end

  # Users can only delete their own bookings, admins unrestricted
  def destroy?
    user_is_owner_or_admin?
  end

  # Scope determines what loads for index
  class Scope < Scope
    def resolve
      if user.role == "admin"
        scope.all
      else
        scope.where(user_id: user.id)
      end
    end
  end

  private

  def user_is_owner_or_admin?
    return false unless user.present?
    user.role == "admin" || record.user_id == user.id
  end

end
