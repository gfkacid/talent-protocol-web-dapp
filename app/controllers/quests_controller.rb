class QuestsController < ApplicationController
  def show
    @quest = QuestBlueprint.render_as_json(quest, view: :normal)
  end

  private

  def quest
    @quest ||= current_acting_user.quests.find_by!("LOWER(type) = LOWER(?)", "Quests::#{params[:id]}")
  end
end
