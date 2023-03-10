class QuestCompletedNotification < BaseNotification
  def should_deliver_digest_email?
    false
  end

  def url
    quest_url(params["type"]) if params["type"]
  end
end
