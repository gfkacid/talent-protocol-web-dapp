# frozen_string_literal: true

module Tasks
  class BuyTalentToken < Task
    def title
      "Buy a Talent Token"
    end

    def description
      "Buy at least one talent token of someone you believe in"
    end

    def reward
      "Talent Mate 'Token Holder' skin unlock"
    end

    def link
      "/talent"
    end
  end
end
