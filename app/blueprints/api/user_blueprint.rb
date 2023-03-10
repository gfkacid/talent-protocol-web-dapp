class API::UserBlueprint < Blueprinter::Base
  view :normal do
    fields :username, :name, :email, :profile_picture_url, :messaging_disabled, :profile_type

    field :id do |user, _options|
      user.uuid
    end

    field :wallet_address do |user, _options|
      user.wallet_id
    end

    field :admin do |user, _options|
      user.admin?
    end

    field :moderator do |user, _options|
      user.moderator?
    end

    field :verified do |user, _options|
      user.talent&.verified?
    end

    field :impersonated do |user, options|
      options[:impersonated]
    end

    field :active_supporter do |user, options|
      user.active_supporter?
    end

    field :supporters_count do |user, options|
      user.talent&.supporters_count || 0
    end

    field :token_launched do |user, options|
      user.talent&.talent_token&.deployed
    end

    field :beginner_quest_completed do |user, _options|
      user.beginner_quest_completed?
    end

    field :tal_domain do |user, options|
      user.tal_domain&.domain
    end

    field :tal_domain_theme do |user, options|
      user.tal_domain&.theme
    end
  end
end
