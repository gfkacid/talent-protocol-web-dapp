class UserTag < ApplicationRecord
  belongs_to :user
  belongs_to :tag, counter_cache: true

  validates :user, uniqueness: {scope: :tag, message: "User tag already exists"}
end
