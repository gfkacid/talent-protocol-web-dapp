class AddUniquenessToUuids < ActiveRecord::Migration[7.0]
  def change
    add_index :users, :uuid, unique: true
    add_index :connections, :uuid, unique: true
  end
end
