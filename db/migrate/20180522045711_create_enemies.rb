class CreateEnemies < ActiveRecord::Migration[5.2]
  def change
    create_table :enemies do |t|
      t.integer :total
      t.text    :type
      t.text    :health
      t.float   :x
      t.float   :y

      t.timestamps
    end
  end
end
