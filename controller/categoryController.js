const db = require('../connection/connection');

const addCategory = (req, res) => {
    const {name} = req.body;
    const sql = 'call inv.sp_add_category(?);';
    db.query(sql, [name], (err, result) => {
      if (err) {
        console.error('Database insertion error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
  
      console.log('Category inserted successfully');
      return res.status(200).json({ message: 'Category inserted successfully' });
    });
};

const GetAllCategories = (req, res) => {
    const sql = 'SELECT * FROM inv.categories;';
    db.query(sql, (err, result) => {
      return res.json(result);
    });
  };

const DeleteCategoryById = (req, res) => {

  const { category_id } = req.body;
  const sql = 'call inv.sp_delete_category(?);'
  db.query(sql,[category_id], (err, result) => {
      if (err) {
          console.error('Database insertion error:', err);
          return res.status(500).json({ error: 'Failed to Remove Category' });
        }
        console.log('Brand Removed successfully');
        return res.status(200).json({ message: 'Category Removed successfully' });
      });  
};


  module.exports = {
    addCategory,
    GetAllCategories,
    DeleteCategoryById
  };