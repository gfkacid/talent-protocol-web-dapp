class OnboardingController < ApplicationController
  def index
    @user = {
      legalFirstName: current_user.legal_first_name,
      legalLastName: current_user.legal_last_name,
      username: current_user.username,
      id: current_user.id
    }

    @talent = {
      occupation: current_user.talent.occupation,
      experienceLevel: current_user.talent.experience_level,
      careerNeeds: current_user.talent.career_goal.career_needs.map(&:title),
      lastPosition: current_user.talent.milestones.where(category: "Position").order(:start_date).last,
      nationality: current_user.talent.profile["nationality"],
      ethnicity: current_user.talent.profile["ethnicity"],
      gender: current_user.talent.profile["gender"]
    }
  end

  def finish
    current_user.talent.update(
      occupation: params[:occupation],
      experience_level: params[:experienceLevel]
    )

    current_user.talent.profile["nationality"] = params[:nationality]
    current_user.talent.profile["ethnicity"] = params[:ethnicity]
    current_user.talent.profile["gender"] = params[:gender]
    current_user.talent.save!

    CareerNeeds::Upsert
      .new(career_goal: current_user.talent.career_goal, titles: params[:careerNeeds])
      .call

    last_milestone = current_user.talent.milestones.where(category: "Position").order(:start_date).last

    if last_milestone.present?
      last_milestone.assign_attributes(milestone_params)
      parsed_date = milestone_params[:start_date].split("-").map(&:to_i)
      last_milestone.start_date = Date.new(parsed_date[2], parsed_date[1], parsed_date[0])
      last_milestone.save
    elsif milestone_params[:title].present? && milestone_params[:start_date].present?
      milestone = Milestone.new(milestone_params)

      parsed_date = milestone_params[:start_date].split("-").map(&:to_i)
      milestone.start_date = Date.new(parsed_date[2], parsed_date[1], parsed_date[0])
      milestone.talent = current_user.talent
      milestone.category = "Position"
      milestone.save!
    end

    current_user.update!(legal_first_name: params[:legal_first_name], legal_last_name: params[:legal_last_name], username: params[:username], onboarded_at: Time.current)

    render json: {success: true}, status: :created
  rescue => e
    Rollbar.error(
      e,
      "Unable to onboard user",
      params
    )
    render json: {error: e.message}, status: :bad_request
  end

  private

  def milestone_params
    params.require(:position).permit(
      :title,
      :start_date,
      :institution,
      :description,
      :link
    )
  end
end
