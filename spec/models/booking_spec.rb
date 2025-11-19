require 'rails_helper'

RSpec.describe Booking, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      booking = build(:booking)
      expect(booking).to be_valid
    end

    it "is invalid without a user" do
      booking = build(:booking, user: nil)
      expect(booking).not_to be_valid
    end

    it "is invalid without an event" do
      booking = build(:booking, event: nil)
      expect(booking).not_to be_valid
    end

    it "is invalid without a status" do
      booking = build(:booking, status: nil)
      expect(booking).not_to be_valid
    end
  end

  describe "associations" do
    it { should belong_to(:user) }
    it { should belong_to(:event) }
  end
end
