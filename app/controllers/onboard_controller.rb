class OnboardController < ApplicationController
  def sign_in
    if profile_subdomain?
      return redirect_to "https://beta.talentprotocol.com/" unless tal_domain

      user = tal_domain.user

      talent =
        Talent
          .includes([career_goal: {goals: :goal_images}, milestones: :milestone_images])
          .find_by!(user: user)

      CreateProfilePageVisitorJob.perform_later(ip: request.remote_ip, user_id: user.id)

      @talent = TalentBlueprint.render_as_json(
        talent,
        view: :extended,
        current_user_watchlist: current_user_watchlist,
        tags: user.tags.where(hidden: false)
      )

      @with_persona_request = WithPersonaRequestBlueprint.render_as_json(WithPersonaRequest.current_month_persona_request)

      render "profiles/show"
    end
  end

  def sign_up
    if current_user.present?
      return redirect_to user_path(username: params[:invite_code]) if user
      return redirect_to talent_index_path
    end
    if params[:invite_code].present?
      @invite = Invite.find_by("code ILIKE ?", params[:invite_code])
    end
  end

  private

  def profile_subdomain?
    request.domain == ENV["TAL_BASE_DOMAIN"]
  end

  def user
    @user ||= User.find_by("username=:invite_code or wallet_id=:invite_code or ens_domain=:invite_code", invite_code: params[:invite_code])
  end
end
