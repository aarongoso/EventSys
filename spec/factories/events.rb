FactoryBot.define do
  factory :event do
    title       { "Sample Event" }
    description { "A test description for an event" }
    location    { "NCI" }
    date        { Date.today }
    time        { Time.now }
    capacity    { 30 }

    association :user  # event belongs to user
  end
end
