# frozen_string_literal: true

module Tasks
  class Perks < Task
    def title
      "Create Perks"
    end

    def link
      "/u/#{quest.user.username}#token"
    end
  end
end
