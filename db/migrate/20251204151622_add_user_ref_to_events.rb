class AddUserRefToEvents < ActiveRecord::Migration[8.0]
  def change
    # linking events back to a user but allowing older events to stay valid
    add_reference :events, :user, foreign_key: true
  end
end
