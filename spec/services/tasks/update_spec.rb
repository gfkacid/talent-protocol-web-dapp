require "rails_helper"

RSpec.describe Tasks::Update do
  subject(:update_task) { described_class.new }

  context "when the quest is the Talent Profile" do
    let(:talent) { create :talent, public: false }
    let(:user) { create :user, talent: talent }
    let(:quest) { create :quest, type: "Quests::TalentProfile", status: "pending", user: user }
    let(:task) { create :task, :highlights, quest: quest }

    it "makes the talent public if the quest is completed" do
      update_task.call(type: task.type, user: user)

      expect(user.talent.public).to eq true
    end

    it "creates a new notification" do
      update_task.call(type: task.type, user: user)

      created_notification = Notification.last

      aggregate_failures do
        expect(created_notification.type).to eq "Quests::CompletedTalentProfileNotification"
        expect(created_notification.params).to eq(
          {
            "type" => quest.short_type,
            "model_id" => quest.id,
            "source_id" => user.id
          }
        )
      end
    end
  end
end
