class Milestone < ApplicationRecord
  has_paper_trail

  belongs_to :talent

  has_many :milestone_images, dependent: :destroy
  accepts_nested_attributes_for :milestone_images, allow_destroy: true
  validates_associated :milestone_images

  validate :end_date_after_start_date, if: -> { end_date.present? }

  enum category: {Position: "Position", Education: "Education", Other: "Other"}

  update_index("talents", :talent)

  after_save :touch_talent

  private

  def end_date_after_start_date
    errors.add(:base, "Start date needs to be before the end date") if start_date > end_date
  end

  def touch_talent
    talent.touch
  end
end
