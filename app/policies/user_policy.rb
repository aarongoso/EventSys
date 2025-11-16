class UserPolicy < ApplicationPolicy

  def index?
    user.role == "admin"
  end

  def show?
    user.role == "admin" || user.id == record.id
  end

  def update?
    user.role == "admin" || user.id == record.id
  end

  def destroy?
    user.role == "admin"
  end

  class Scope < Scope
    def resolve
      user.role == "admin" ? scope.all : scope.where(id: user.id)
    end
  end

end
