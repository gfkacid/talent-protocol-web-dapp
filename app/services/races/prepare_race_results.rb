module Races
  class PrepareRaceResults
    def initialize(race:, user:)
      @race = race
      @user = user
    end

    def call
      unless race
        return {
          top5: [],
          userStats: {}
        }
      end

      results = race.results.to_a

      user_stats = {
        username: user.username,
        name: user.name,
        profilePictureUrl: user.profile_picture_url,
        id: user.id
      }
      user_stats[:position] = results.find_index { |r| r["id"] == user.id }
      if user_stats[:position].nil?
        user_stats[:position] = results.count
        user_stats[:invites] = 0
      else
        user_stats[:invites] = results[user_stats[:position]]["overall_result"]
      end

      user_stats[:position] += 1

      top5 = []

      results.first(10).each_with_index do |u, index|
        leaderboard_user = User.find(u["id"])
        top5 << {
          id: leaderboard_user.id,
          position: index + 1,
          name: leaderboard_user.name,
          username: leaderboard_user.username,
          profilePictureUrl: leaderboard_user.profile_picture_url,
          invites: u["overall_result"]
        }
      end

      {
        top5: top5,
        userStats: user_stats
      }
    end

    private

    attr_reader :user, :race
  end
end
