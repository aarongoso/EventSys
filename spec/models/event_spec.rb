require 'rails_helper'

RSpec.describe Event, type: :model do
  describe "validations" do
    it "is valid with valid attributes" do
      event = build(:event)
      expect(event).to be_valid
    end

    it "is invalid without a title" do
      event = build(:event, title: nil)
      expect(event).not_to be_valid
    end

    it "is invalid without a description" do
      event = build(:event, description: nil)
      expect(event).not_to be_valid
    end
  end

  describe "associations" do
    it { should belong_to(:user) }
    it { should have_many(:bookings).dependent(:destroy) }
  end
end
