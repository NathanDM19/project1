class CreateItems < ActiveRecord::Migration[5.2]
  def change
    create_table :items do |t|
      t.text :name
      t.text :description
      t.integer :price
      t.integer :character_id

      t.timestamps
    end
  end
end
