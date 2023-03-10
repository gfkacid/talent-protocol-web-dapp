module Users
  class Create
    attr_reader :result

    def initialize
      @result = {}
    end

    def call(params)
      ActiveRecord::Base.transaction do
        invite = Invite.find_by(code: params[:invite_code])
        invite&.update(uses: invite.uses + 1)
        params[:invite] = invite if invite
        user = create_user(params)

        create_talent(user, params)
        create_talent_token(user)
        create_invite_used_notification(invite, user) if invite

        if invite&.talent_invite?
          update_profile_type(user, invite)
        end

        create_invite(user)
        create_tasks(user)
        create_follow(invite, user)

        UserMailer.with(user: user).send_welcome_email.deliver_later(wait: 5.seconds)

        @result[:user] = user
        @result[:success] = true
        @result
      rescue ActiveRecord::RecordNotUnique, ActiveRecord::RecordInvalid => error
        @result[:success] = false
        error_message = error.message.downcase

        if error_message.include?("username")
          @result[:field] = "username"
          @result[:error] = "Username is already taken."
        elsif error_message.include?("email")
          @result[:field] = "email"
          @result[:error] = "Email is already taken."
        elsif error_message.include?("wallet")
          @result[:field] = "wallet_id"
          @result[:error] = "We already have that wallet in the system."
        end
        @result
      rescue => e
        Rollbar.error(
          e,
          "Unable to create user with unexpected error.",
          email: params[:email],
          username: params[:username]
        )

        raise e
      end
    end

    private

    def create_user(params)
      user = User.new(attributes(params))
      user.save!
      user
    end

    def attributes(params)
      {
        display_name: params[:display_name],
        email_confirmation_token: Clearance::Token.new,
        email: params[:email].downcase,
        wallet_id: params[:wallet_id]&.downcase,
        invited: params[:invite],
        linkedin_id: params[:linkedin_id],
        password: params[:password],
        role: "basic",
        theme_preference: params[:theme_preference],
        legal_first_name: params[:legal_first_name],
        legal_last_name: params[:legal_last_name],
        username: params[:username].downcase.delete(" ", "")
      }.compact
    end

    def create_talent(user, params)
      talent = user.create_talent!
      user.talent.create_career_goal!
      talent.update(gender: params[:gender])
      talent.update(location: params[:location])
      talent.update(nationality: params[:nationality])
      talent.update(headline: params[:headline])

      params[:tags].each do |description|
        tag = Tag.find_or_create_by(description: description.downcase)
        UserTag.find_or_create_by!(user: user, tag: tag)
      end
      CareerNeeds::Upsert.new(career_goal: talent.career_goal, titles: params[:career_needs]).call
    end

    def create_talent_token(user)
      user.talent.create_talent_token!
    end

    def create_invite(user)
      service = Invites::Create.new(user: user)
      service.call
    end

    def create_tasks(user)
      Tasks::PopulateForUser.new.call(user: user)
      Tasks::Update.new.call(type: "Tasks::ApplyTokenLaunch", user: user)
    end

    def create_invite_used_notification(invite, user)
      inviter = invite.user
      return unless inviter

      CreateNotification.new.call(recipient: inviter, source_id: user.id, type: InviteUsedNotification)
    end

    def update_profile_type(user, invite)
      Users::UpdateProfileType.new.call(user: user, who_dunnit_id: invite.user_id, new_profile_type: "talent")
      user.reload
    end

    def create_follow(invite, user)
      return unless invite

      invited_by_user = invite.user
      return unless invited_by_user

      follow = Follow.find_or_initialize_by(user_id: user.id, follower_id: invited_by_user.id)
      unless follow.persisted? # validate if the watchlist quest is completed
        UpdateTasksJob.perform_later(type: "Tasks::Watchlist", user_id: invited_by_user.id)
      end
    end
  end
end
