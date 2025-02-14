FactoryBot.define do
  factory :admin_user, class: "User" do
    username { "Admin" }
    email { "admin@talentprotocol.com" }
    password { "password" }
    role { "admin" }
  end

  factory :message do
  end

  factory :wait_list do
    email { Faker::Internet.email }
  end

  factory :notification do
    type { MessageReceivedNotification.name }
  end
end
