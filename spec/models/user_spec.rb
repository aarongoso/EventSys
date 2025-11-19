require 'rails_helper'

RSpec.describe User, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      user = build(:user)
      expect(user).to be_valid
    end

    it "is invalid without a name" do
      user = build(:user, name: nil)
      expect(user).not_to be_valid
    end

    it "is invalid with a short name" do
      user = build(:user, name: "A")
      expect(user).not_to be_valid
    end

    it "assigns a default role when none is provided" do
      user = User.new(
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      role: nil
     )

     user.valid?  # triggers callbacks
    expect(user.role).to eq("user")
  end
end

  describe "associations" do
    it { should have_many(:events).dependent(:destroy) }
    it { should have_many(:bookings).dependent(:destroy) }
  end
end
