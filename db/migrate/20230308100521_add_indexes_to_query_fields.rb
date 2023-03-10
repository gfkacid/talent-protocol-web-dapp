class AddIndexesToQueryFields < ActiveRecord::Migration[7.0]
  def change
    add_index :users, :created_at
    add_index :connections, :created_at
    add_index :connections, :connection_type
  end
end
