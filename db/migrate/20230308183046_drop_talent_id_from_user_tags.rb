class DropTalentIdFromUserTags < ActiveRecord::Migration[7.0]
  def change
    remove_column :user_tags, :talent_id
  end
end
