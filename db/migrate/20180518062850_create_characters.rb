class CreateCharacters < ActiveRecord::Migration[5.2]
  def change
    create_table :characters do |t|
      t.text :name
      t.integer :gold
      t.integer :user_id

      t.timestamps
    end
  end
end
