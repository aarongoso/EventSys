FactoryBot.define do
  factory :booking do
    status { "confirmed" }

    association :user
    association :event
  end
end
